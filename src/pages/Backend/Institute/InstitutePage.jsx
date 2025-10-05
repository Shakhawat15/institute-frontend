import axios from "axios";
import { useState } from "react";
import { AxiosHeader, baseURL } from "../../../API/config";
import { ErrorToast } from "../../../helper/FormHelper";
import bangladeshData from "../../../data/bangladeshData.json";
import MasterLayout from "../../../components/Backend/BackendMasterLayout/MasterLayout";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const InstitutePage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    thana: "",
    instituteType: "",
    managementType: "",
    eiin: "",
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Dynamically load districts & thanas
  const availableDistricts = filters.division
    ? Object.keys(bangladeshData[filters.division] || {})
    : [];
  const availableThanas =
    filters.division && filters.district
      ? bangladeshData[filters.division][filters.district] || []
      : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      ...(name === "division" ? { district: "", thana: "" } : {}),
      ...(name === "district" ? { thana: "" } : {}),
    });
  };

  const handleReset = () => {
    setFilters({
      division: "",
      district: "",
      thana: "",
      instituteType: "",
      managementType: "",
      eiin: "",
    });
    setProducts([]);
    setSearched(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setProducts([]);
    try {
      const response = await axios.get(`${baseURL}/institutes/search`, {
        ...AxiosHeader,
        params: filters,
      });
      setProducts(response.data.data || []);
      setSearched(true);
    } catch (error) {
      setProducts([]);
      ErrorToast(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // ✅ Download Excel
  // ✅ Download Excel (excluding all *_id or id fields)
  const handleDownloadExcel = () => {
    if (!products.length) {
      ErrorToast("No data to export");
      return;
    }

    // 1. Get all keys from the first object
    const allKeys = Object.keys(products[0] || {});

    // 2. Filter out any field containing 'id' (case insensitive)
    const filteredKeys = allKeys.filter(
      (key) => !key.toLowerCase().includes("id")
    );

    // 3. Map data only with filtered keys
    const exportData = products.map((item, index) => {
      const newObj = { SL: index + 1 };
      filteredKeys.forEach((key) => {
        newObj[key] = item[key];
      });
      return newObj;
    });

    // 4. Convert to Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Institutes");

    // 5. Create Excel file and download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Institute_Search_Results.xlsx");
  };

  return (
    <MasterLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="w-full bg-white shadow-lg rounded-none p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800 border-b pb-3">
            🎓 Institute Search Portal
          </h2>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-3 items-center justify-center overflow-x-auto pb-4"
          >
            {/* Division */}
            <select
              name="division"
              value={filters.division}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200 min-w-[160px]"
            >
              <option value="">Select Division</option>
              {Object.keys(bangladeshData).map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              name="district"
              value={filters.district}
              onChange={handleChange}
              disabled={!filters.division}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200 min-w-[160px] disabled:opacity-60"
            >
              <option value="">Select District</option>
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            {/* Thana */}
            <select
              name="thana"
              value={filters.thana}
              onChange={handleChange}
              disabled={!filters.district}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200 min-w-[160px] disabled:opacity-60"
            >
              <option value="">Select Thana</option>
              {availableThanas.map((thana) => (
                <option key={thana} value={thana}>
                  {thana}
                </option>
              ))}
            </select>

            {/* Institute Type */}
            <select
              name="instituteType"
              value={filters.instituteType}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200 min-w-[160px]"
            >
              <option value="">Institute Type</option>
              <option value="SCHOOL">School</option>
              <option value="COLLEGE">College</option>
            </select>

            {/* Management Type */}
            <select
              name="managementType"
              value={filters.managementType}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200 min-w-[160px]"
            >
              <option value="">Management Type</option>
              <option value="Govt">Government</option>
              <option value="Private">Private</option>
            </select>

            {/* EIIN */}
            <input
              type="text"
              name="eiin"
              placeholder="EIIN Number"
              value={filters.eiin}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200 min-w-[160px]"
            />

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition duration-300"
              >
                🔍 Search
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg transition duration-300"
                onClick={handleReset}
              >
                Reset
              </button>
              {/* ✅ Excel Download Button */}
              {searched && products.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition duration-300"
                >
                  ⬇️ Download Excel
                </button>
              )}
            </div>
          </form>

          {/* Results */}
          <div className="w-full overflow-x-auto">
            {loading ? (
              <p className="text-center text-gray-600 py-6">Loading...</p>
            ) : searched ? (
              products.length > 0 ? (
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-blue-50 text-gray-700">
                    <tr>
                      <th className="p-2 border">#</th>
                      <th className="p-2 border text-left">Institute Name</th>
                      <th className="p-2 border">EIIN</th>
                      <th className="p-2 border">Type</th>
                      <th className="p-2 border">Division</th>
                      <th className="p-2 border">District</th>
                      <th className="p-2 border">Thana</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Mobile</th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, index) => (
                      <tr
                        key={item._id || index}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-2 border text-center">{index + 1}</td>
                        <td className="p-2 border">{item.instituteName}</td>
                        <td className="p-2 border text-center">
                          {item.eiinNo}
                        </td>
                        <td className="p-2 border text-center">
                          {item.instituteTypeName}
                        </td>
                        <td className="p-2 border">{item.divisionName}</td>
                        <td className="p-2 border">{item.districtName}</td>
                        <td className="p-2 border">{item.thanaName}</td>
                        <td className="p-2 border text-center">
                          {item.email || "N/A"}
                        </td>
                        <td className="p-2 border text-center">
                          {item.mobile || "N/A"}
                        </td>
                        <td
                          className={`p-2 border font-semibold text-center ${
                            item.verification === "Verified"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {item.verification}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-600 py-6">
                  No institutes found.
                </p>
              )
            ) : (
              <p className="text-center text-gray-600 py-6">
                🔍 Please search to view results.
              </p>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default InstitutePage;
