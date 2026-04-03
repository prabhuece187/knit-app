import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Customer from "./pages/customer/Customer";
import State from "./pages/state/State";
import Item from "./pages/items/Item";
import Mill from "./pages/mill/Mill";
import YarnType from "./pages/yarntype/YarnType";
import Inward from "./pages/inward/Inward";
import AddInward from "./pages/inward/component/AddInward";
import EditInward from "./pages/inward/component/EditInward";
import Outward from "./pages/outward/Outward";
import AddOutward from "./pages/outward/component/AddOutward";
import EditOutward from "./pages/outward/component/EditOutward";
import OverAllReport from "./pages/report/OverAll";
import OverAllDetailReport from "./pages/report/OverAllDetail";
import IndividualData from "./pages/report/common/IndividualData";
import Invoice from "./pages/invoice/Invoice";
import AddInvoice from "./pages/invoice/component/AddInvoice";
import Bank from "./pages/bank/Bank";
import EditInvoice from "./pages/invoice/component/EditInvoice";
import PrintInvoice from "./pages/invoice/component/PrintInvoice";
import Payment from "./pages/payment/Payment";
import AddPayment from "./pages/payment/component/AddPayment";
import ProductionReturn from "./pages/pro-return/ProductionReturn";
import JobMaster from "./pages/job-master/JobMaster";
import KnittingMachine from "./pages/machine/KnittingMachine";
import KnittingProduction from "./pages/production/KnittingProduction";
import AddKnittingProduction from "./pages/production/component/AddKnittingProduction";
import EditKnittingProduction from "./pages/production/component/EditKnittingProduction";
import ProductionRework from "./pages/pro-rework/ProductionRework";
import JobLedgerReport from "./pages/report/JobLedgerReport";
import WastageReport from "./pages/report/WastageReport";
import SessionExpired from "./pages/auth/components/sessionExpired";
import NotFound from "@/components/custom/NotFound";
import Error401 from "@/components/custom/Error401";
import Error500 from "@/components/custom/Error500";

import { useAppSelector } from "@/store/Store";
import AdminLoginPage from "./pages/auth/pages/AdminLoginPage";
import Login from "./pages/Login";
import District from "./pages/district/District";
import City from "./pages/city/City";
import EditProfessional from "./pages/professional/EditProfessional";
import Professional from "./pages/professional/Professional";

function App() {

  const { accessToken, sessionExpired } = useAppSelector((state) => state.auth);

  return (
    <>
      {sessionExpired && <SessionExpired />}
      <Routes>

        <Route path="/404" element={<NotFound />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="/500" element={<Error500 />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />


        <Route
          path="/"
          element={accessToken ? <Layout /> : <Navigate to="/login" replace />}
        >
          {/* <Route path="/" element={<Layout />}> */}
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Master */}
          <Route path="banks" element={<Bank />} />
          <Route path="customers" element={<Customer />} />
          <Route path="items" element={<Item />} />
          <Route path="states" element={<State />} />
          <Route path="districts" element={<District />} />
          <Route path="cities" element={<City />} />
          <Route path="mills" element={<Mill />} />
          <Route path="yarn_types" element={<YarnType />} />
          <Route path="knitting-machine" element={<KnittingMachine />} />

          {/* Inward */}
          <Route path="inward" element={<Inward />} />
          <Route path="addinward" element={<AddInward />} />
          {/* this id set same as params inwardId */}
          <Route path="/editinward/:inwardId" element={<EditInward />} />

          {/* Outward */}
          <Route path="outward" element={<Outward />} />
          <Route path="addoutward" element={<AddOutward />} />
          <Route path="/editoutward/:outwardId" element={<EditOutward />} />

          {/* Job Master */}
          <Route path="job-master" element={<JobMaster />} />

          {/* Production Return */}
          <Route path="pro-return" element={<ProductionReturn />} />

          {/* Production  */}
          <Route path="knit-pro" element={<KnittingProduction />} />
          <Route
            path="add-knitting-production"
            element={<AddKnittingProduction />}
          />
          <Route
            path="/knitting_production_edit/:id"
            element={<EditKnittingProduction />}
          />

          {/* Production Rework */}
          <Route path="pro-rework" element={<ProductionRework />} />

          {/* Invoice */}
          <Route path="invoice" element={<Invoice />} />
          <Route path="addinvoice" element={<AddInvoice />} />
          <Route path="/editinvoice/:invoiceId" element={<EditInvoice />} />
          <Route
            path="/printinvoice/:invoiceId"
            element={<PrintInvoice />}
          />

          {/* Payment */}
          <Route path="payment" element={<Payment />} />
          <Route path="addpayment" element={<AddPayment />} />

          {/* Report */}
          <Route path="over-all-report" element={<OverAllReport />} />
          <Route
            path="over-all-detail-report"
            element={<OverAllDetailReport />}
          />

          <Route path="job-ledger" element={<JobLedgerReport />} />
          <Route path="wastage" element={<WastageReport />} />


          {/* Professional */}
          <Route path="professionals/:id" element={<EditProfessional />} />
          <Route path="professionals" element={<Professional />} />

          {/* Add-on Service */}
          <Route path="customers/:id" element={<IndividualData />} />
          <Route path="items/:id" element={<IndividualData />} />
          <Route path="mills/:id" element={<IndividualData />} />
          <Route path="yarn_types/:id" element={<IndividualData />} />
          <Route path="banks/:id" element={<IndividualData />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>

  );
}

export default App;
