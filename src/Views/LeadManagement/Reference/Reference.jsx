import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import DataTable from "../../../Components/DataTable/DataTable";
import { getReference } from "../../../services/leadService";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import WhatsAppModal from "../../../Components/WhatsApp/WhatsAppModal";
import { formatUrl, getStatusColor } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";

function Reference(args) {
  const [routeURL, SetrouteURL] = useState("add");
  const [referenceData, setReferencesData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false); // To prevent multiple API calls
  const [modal, setModal] = useState(false);
  const [selectedWhatsAppNumber, setSelectedWhatsAppNumber] = useState(null);

  // Modified toggle function to accept the WhatsApp number
  const toggle = (number) => {
    setSelectedWhatsAppNumber(number);
    setModal(!modal);
  };

  useEffect(() => {
    if (!hasFetched) {
      const fetchRoles = async () => {
        try {
          const response = await getReference(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setReferencesData(response?.data?.data?.references); // Assuming `Contacts` contains the roles data
              setHasFetched(true); // Set to true after the first fetch
            }
          } else {
            if (response?.status !== 404) {
              toast.error(
                response?.response?.data?.error?.message ||
                  "Failed to fetch contacts data."
              );
            }
          }
        } catch (error) {
          if (response?.status !== 404) {
            toast.error(
              "An error occurred while fetching contacts data. Please try again."
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
        Header: "Name", // Combines salutation, firstName, and lastName
        accessor: "name",
        Cell: ({ row }) =>
          `${row.original.salutation || ""} ${row.original.firstName || ""} ${
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
        Cell: ({ row }) => {
          const countryCode =
            row.original.mobile.countryCode &&
            row.original.mobile.countryCode !== "0"
              ? `${row.original.mobile.countryCode}`
              : "";
          const mobile =
            row.original.mobile.mobileNumber &&
            row.original.mobile.mobileNumber !== "0"
              ? row.original.mobile.mobileNumber
              : "--";
          return `${countryCode}${mobile}`.trim();
        },
      },
      {
        Header: "WhatsApp Number",
        accessor: "whatsAppNumber",
        Cell: ({ row }) => {
          const countryCode =
            row.original.whatsApp.countryCode &&
            row.original.whatsApp.countryCode !== "0"
              ? `${row.original.whatsApp.countryCode}`
              : "";
          const mobile =
            row.original.whatsApp.whatsAppNumber &&
            row.original.whatsApp.whatsAppNumber !== "0"
              ? row.original.whatsApp.whatsAppNumber
              : "";
          const fullNumber = `${countryCode}${mobile}`.trim();
          return fullNumber ? (
            <Link
              onClick={() => toggle(fullNumber)}
              style={{ color: "#51cbce" }}
            >
              {fullNumber}
            </Link>
          ) : (
            "--"
          );
        },
      },
      {
        Header: "Company",
        accessor: "companyName", // Display the company name
      },
      {
        Header: "Website",
        accessor: "website", // Display the website as a clickable link
        Cell: ({ value }) => {
          const formattedUrl = formatUrl(value);
          return (
            <a href={formattedUrl} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          );
        },
      },
      {
        Header: "Profile Photo",
        accessor: "profilePhoto", // Display the profile photo
        Cell: ({ value }) =>
          value ? (
            <img
              src={value}
              alt="Profile"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            "--"
          ),
      },
      {
        Header: "Business Card Photo",
        accessor: "businessCardPhoto", // Display the business card photo
        Cell: ({ value }) =>
          value ? (
            <img
              src={value}
              alt="Business Card"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ) : (
            "--"
          ),
      },
      {
        Header: "Status",
        accessor: "status", // Display the status
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
      // {
      //   Header: "Created By",
      //   accessor: "createdBy", // Display who created the entry
      // },
      {
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },
      {
        Header: "Action", // Edit action
        accessor: "edit", // Dummy accessor for this column
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.referenceId}`}
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
        tabletitle={"REFERENCE"}
        columnsData={columnsData}
        tableData={referenceData}
      />
      {/* Modal popup */}
      <div>
        <Modal isOpen={modal} {...args}>
          <ModalHeader toggle={toggle}>WhatsApp Message</ModalHeader>
          <ModalBody>
            <WhatsAppModal
              mobileNumber={selectedWhatsAppNumber}
              cancle={toggle}
            />
          </ModalBody>
          {/* <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter> */}
        </Modal>
      </div>
    </>
  );
}

export default Reference;
