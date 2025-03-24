import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import Login from "./auth/Login.jsx";
import SignUp from "./auth/SignUp.jsx";
import ForgotPassword from "./auth/ForgotPassword.jsx";
import ChangePassword from "./auth/ChangePassword.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import VerifyCode from "./auth/VerifyCode.jsx";
import SuccesModal from "./auth/SuccesModal.jsx";
import Dashboard from "./Views/Dashboard/Dashboard.jsx";
import Roles from "./Views/Master/Roles/Roles.jsx";
import AddRoles from "./Views/Master/Roles/AddRoles.jsx";
import Designation from "./Views/Master/Designation/Designation.jsx";
import AddDesignation from "./Views/Master/Designation/AddDesignation.jsx";
import Organizations from "./Views/Master/Organization/Organizations.jsx";
import AddOrganization from "./Views/Master/Organization/AddOrganization.jsx";
import Projects from "./Views/Master/Organization/Projects/Projects.jsx";
import AddProjects from "./Views/Master/Organization/Projects/AddProjects.jsx";
import Services from "./Views/Master/Organization/Projects/Services/Services.jsx";
import AddServices from "./Views/Master/Organization/Projects/AddProjects.jsx";
import ErrorPage from "./Views/ErrorPage/ErrorPage.jsx";
import "./App.css";
import AuthContext from "./store/auth/auth-context";
import Contacts from "./Views/LeadManagement/Contact/Contacts.jsx";
import AddContact from "./Views/LeadManagement/Contact/AddContact.jsx";
import Reference from "./Views/LeadManagement/Reference/Reference.jsx";
import AddReference from "./Views/LeadManagement/Reference/AddReference.jsx";
import Leads from "./Views/LeadManagement/Leads/Leads.jsx";
import AddLeads from "./Views/LeadManagement/Leads/AddLeads.jsx";
import LeadsSource from "./Views/LeadManagement/LeadsSource/LeadsSource.jsx";
import AddLeadsSource from "./Views/LeadManagement/LeadsSource/AddLeadsSource.jsx";
import LeadsTag from "./Views/LeadManagement/LeadsTag/LeadsTag.jsx";
import AddLeadsTag from "./Views/LeadManagement/LeadsTag/AddLeadsTag.jsx";
import LeadsStatus from "./Views/LeadManagement/LeadsStatus/LeadsStatus.jsx";
import AddLeadsStatus from "./Views/LeadManagement/LeadsStatus/AddLeadsStatus.jsx";
import Followups from "./Views/LeadManagement/Leads/Followups/Followups.jsx";
import AddFollowups from "./Views/LeadManagement/Leads/Followups/AddFollowups.jsx";
import EmployeeList from "./Views/EmployeeManagement/EmployeeList.jsx";
import AddEmployee from "./Views/EmployeeManagement/AddEmployee.jsx";
import ContactTag from "./Views/CampaignManagement/ContactTag/ContactTag.jsx";
import AddContactTag from "./Views/CampaignManagement/ContactTag/AddContactTag.jsx";
import AddTemplate from "./Views/CampaignManagement/Template/AddTemplate.jsx";
import Template from "./Views/CampaignManagement/Template/Template.jsx";
import AddCampaign from "./Views/CampaignManagement/Campaign/AddCampaign.jsx";
import Campaign from "./Views/CampaignManagement/Campaign/Campaign.jsx";
import AddCampaignScheduling from "./Views/CampaignManagement/CampaignScheduling/AddCampaignScheduling.jsx";
import CampaignScheduling from "./Views/CampaignManagement/CampaignScheduling/CampaignScheduling.jsx";

import "./assets/scss/style.scss";
import "./assets/scss/style-preset.scss";
import "./assets/scss/landing.scss"

function App() {
  const auth = useContext(AuthContext);
  // const navigate = useNavigate();
  const isLoggedIn = auth.isLoggedIn;

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("login");
  //   }
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default route */}

          {/* Admin routes */}
          {isLoggedIn && (
            <>
              <Route
                path="/"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />

                {/* Master section */}
                <Route path="master">
                  <Route
                    path="/admin/master"
                    element={<Navigate to="/admin/master/roles" replace />}
                  />
                  {/* roles */}
                  <Route path="roles" element={<Roles />} />
                  <Route path="roles/add" element={<AddRoles />} />
                  <Route path="roles/:roleId" element={<AddRoles />} />
                  {/* designation */}
                  <Route path="designation" element={<Designation />} />
                  <Route path="designation/add" element={<AddDesignation />} />
                  <Route
                    path="designation/:designationId"
                    element={<AddDesignation />}
                  />
                  {/* organization */}
                  <Route path="organization" element={<Organizations />} />
                  <Route
                    path="organization/add"
                    element={<AddOrganization />}
                  />
                  <Route
                    path="organization/:organizationId"
                    element={<AddOrganization />}
                  />
                  {/* projects */}
                  {/* <Route
                    path="organization/projects/:organizationId"
                    element={<Projects />}
                  />
                  <Route
                    path="organization/projects/:organizationId/add"
                    element={<AddProjects />}
                  />
                  <Route
                    path="organization/projects/:organizationId/:projectId"
                    element={<AddProjects />}
                  /> */}
                  {/* services */}
                  {/* Notice the different parameter name for services */}
                  {/* <Route
                    path="organization/projects/:organizationId/services/:serviceProjectId"
                    element={<Services />}
                  />
                  <Route
                    path="organization/projects/:organizationId/services/:serviceProjectId/add"
                    element={<AddServices />}
                  />
                  <Route
                    path="organization/projects/:organizationId/services/:serviceProjectId/:serviceId"
                    element={<AddServices />}
                  /> */}
                </Route>

                {/* Lead Section*/}
                <Route path="lead">
                  <Route
                    path="/admin/lead"
                    element={<Navigate to="/admin/lead/contacts" replace />}
                  />
                  {/* Contacts */}
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="contacts/add" element={<AddContact />} />
                  <Route path="contacts/:contactId" element={<AddContact />} />
                  {/* Reference */}
                  <Route path="reference" element={<Reference />} />
                  <Route path="reference/add" element={<AddReference />} />
                  <Route
                    path="reference/:referenceId"
                    element={<AddReference />}
                  />
                  {/* Leads */}
                  <Route path="leads" element={<Leads />} />
                  <Route path="leads/add" element={<AddLeads />} />
                  <Route path="leads/:leadId" element={<AddLeads />} />
                  {/* Lead Followups */}
                  {/* <Route
                    path="leads/:projectId/:leadId/followups"
                    element={<Followups />}
                  />
                  <Route
                    path="leads/:projectId/:leadId/followups/add"
                    element={<AddFollowups />}
                  />
                  <Route
                    path="leads/:projectId/:leadId/followups/:leadFollowupId"
                    element={<AddFollowups />}
                  /> */}
                  {/* Leads Source */}
                  <Route path="leadsSource" element={<LeadsSource />} />
                  <Route path="leadsSource/add" element={<AddLeadsSource />} />
                  <Route
                    path="leadsSource/:leadSourceId"
                    element={<AddLeadsSource />}
                  />
                  {/* Leads Tag */}
                  <Route path="leadsTag" element={<LeadsTag />} />
                  {/* <Route
                    path="leadsTag/:projectId/add"
                    element={<AddLeadsTag />}
                  />
                  <Route
                    path="leadsTag/:projectId/:leadTagId"
                    element={<AddLeadsTag />}
                  /> */}
                  {/* Leads Status */}
                  <Route path="leadsStatus" element={<LeadsStatus />} />
                  {/* <Route
                    path="leadsStatus/:projectId/add"
                    element={<AddLeadsStatus />}
                  />
                  <Route
                    path="leadsStatus/:projectId/:leadStatusId"
                    element={<AddLeadsStatus />}
                  /> */}
                  {/*  */}
                </Route>

                {/* employee Section*/}
                <Route path="employee">
                  {/* Employee */}
                  <Route
                    path="/admin/employee"
                    element={<Navigate to="/admin/employee/list" replace />}
                  />
                  <Route path="list" element={<EmployeeList />} />
                  <Route path="list/add" element={<AddEmployee />} />
                  <Route path="list/:employeeId" element={<AddEmployee />} />
                </Route>

                {/* campaign Section*/}
                <Route path="campaign">
                  <Route
                    path="/admin/campaign"
                    element={
                      <Navigate to="/admin/campaign/contactTag" replace />
                    }
                  />

                  {/* contactTag */}
                  <Route path="contactTag" element={<ContactTag />} />
                  <Route path="contactTag/add" element={<AddContactTag />} />
                  <Route
                    path="contactTag/:contactTagId"
                    element={<AddContactTag />}
                  />

                  {/* Template */}
                  <Route path="template" element={<Template />} />
                  <Route path="template/add" element={<AddTemplate />} />
                  <Route
                    path="template/:templateId"
                    element={<AddTemplate />}
                  />

                  {/* Campaign */}
                  <Route path="campaign" element={<Campaign />} />
                  <Route path="campaign/add" element={<AddCampaign />} />
                  <Route
                    path="campaign/:campaignId"
                    element={<AddCampaign />}
                  />

                  {/* Campaign Scheduling */}
                  <Route
                    path="campaignScheduling"
                    element={<CampaignScheduling />}
                  />
                  <Route
                    path="campaignScheduling/add"
                    element={<AddCampaignScheduling />}
                  />
                  <Route
                    path="campaignScheduling/:campSchedulingId"
                    element={<AddCampaignScheduling />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<ErrorPage />} />
            </>
          )}
          {isLoggedIn && (
            <>
              <Route path="/changePassword" element={<ChangePassword />} />
            </>
          )}
          {/* Authentication routes */}
          {!isLoggedIn && (
            <>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/verify" element={<VerifyCode />} />
              <Route
                path="/verify/:userId/:verifyCode"
                element={<VerifyCode />}
              />
              <Route path="/successModal" element={<SuccesModal />} />
              <Route path="*" element={<ErrorPage />} />
            </>
          )}
          {/* Catch-all 404 route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
