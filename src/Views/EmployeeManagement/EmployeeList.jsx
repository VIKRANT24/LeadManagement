import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable";
import { getEmployeeList } from "../../services/userService";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import OrgModal from "./OrgModal/OrgModal";
import ProjModal from "./ProjModal/ProjModal";
import { getStatusColor } from "../../utils/commonFunction";

function EmployeeList(args) {
  const [routeURL, SetrouteURL] = useState("add");
  const [employeesData, setEmployeesData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [modal, setModal] = useState(false);
  const [proModal, setProModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const toggle = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setModal(!modal);
  };

  const proToggle = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setProModal(!proModal);
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getEmployeeList(); // Await the asynchronous call
          if (response.status === 200) {
            if (response?.data?.success) {
              setEmployeesData(response?.data?.data?.employee); // Assuming `Contacts` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch  data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching  data. Please try again."
            );
            console.error("Error:", error);
          }
        }
      };

      fetchRoles(); // Call the async function
    }
  }, [hasFetched]); // Dependency ensures this runs only once

  const columnsData = React.useMemo(
    () => [
      {
        Header: "SR", // Serial Number
        accessor: (row, index) => index + 1, // Dynamically generated serial numbers
      },
      {
        Header: "Name", // Combines firstName and lastName
        accessor: "name",
        Cell: ({ row }) =>
          `${row.original.firstName || ""} ${
            row.original.lastName || ""
          }`.trim(),
      },
      {
        Header: "Email ID",
        accessor: "emailId", // Display the email ID
      },
      {
        Header: "Mobile Number",
        accessor: "mobileNumber",
        Cell: ({ row }) =>
          `${row.original.mobileNumber?.countryCode || ""}${
            row.original.mobileNumber?.mobileNumber || "--"
          }`.trim(),
      },
      {
        Header: "Role",
        accessor: "role.roleName", // Access nested roleName
        Cell: ({ row }) => row.original.role?.roleName || "--",
      },
      {
        Header: "Designation",
        accessor: "destination.designation", // Access nested designation
        Cell: ({ row }) => row.original.destination?.designation || "--",
      },
      {
        Header: "Reporting To",
        accessor: "reportingTo",
        Cell: ({ row }) =>
          `${row.original.reportingTo?.firstName || ""} ${
            row.original.reportingTo?.lastName || ""
          }`.trim() || "--",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            style={{
              backgroundColor: getStatusColor(value),
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "inline-block",
              fontWeight: "bold",
              width: "100px",
              textAlign: "center",
            }}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "actions",
        Cell: ({ row }) => (
          <div
            className="editIconContainer"
            style={{ display: "flex", gap: "10px" }}
          >
            <Link
              onClick={(e) => {
                e.preventDefault();
                toggle(row.original.userId);
              }}
              style={{ color: "#51cbce", background: "#4ba6ed" }}
              className="editIcon"
            >
              <i
                className="fa fa-sitemap"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>
            <Link
              onClick={(e) => {
                e.preventDefault();
                proToggle(row.original.userId);
              }}
              style={{ color: "#51cbce", background: "#4ba6ed" }}
              className="editIcon"
            >
              <i
                className="fa fa-building"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>
            <Link
              to={`${row.original.userId}`}
              style={{ color: "#51cbce" }}
              className="editIcon"
            >
              <i
                className="fa fa-pencil-square-o"
                aria-hidden="true"
                style={{ cursor: "pointer", fontSize: "16px" }}
              ></i>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} />
      <DataTable
        routeURL={routeURL}
        tabletitle={"EMPLOYEE"}
        columnsData={columnsData}
        tableData={employeesData}
      />

      {/* Org Modal popup */}
      <div>
        <Modal isOpen={modal} {...args}>
          <ModalHeader toggle={toggle}>Add Projects</ModalHeader>
          <ModalBody>
            <OrgModal employeeId={selectedEmployeeId} cancle={toggle} />
          </ModalBody>
        </Modal>
      </div>

      {/* Pro Modal popup */}
      <div>
        <Modal isOpen={proModal} {...args}>
          <ModalHeader toggle={proToggle}>Add Project</ModalHeader>
          <ModalBody>
            <ProjModal employeeId={selectedEmployeeId} cancle={proToggle} />
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}

export default EmployeeList;
