import MasterLayout from "../../../components/Backend/BackendMasterLayout/MasterLayout";
import { getUser } from "../../../helper/SessionHelper";

export default function Index() {
  return (
    <div>
      <MasterLayout>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome, {getUser().name}!
          </h2>
        </div>
      </MasterLayout>
    </div>
  );
}
