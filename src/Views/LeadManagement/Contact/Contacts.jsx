import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getContacts } from "../../../services/leadService";
import DataTable from "../../../Components/DataTable/DataTable";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import WhatsAppModal from "../../../Components/WhatsApp/WhatsAppModal";
import { formatUrl, getStatusColor } from "../../../utils/commonFunction";
import { formatDateTime } from "../../../utils/formatDateTime";

function Contacts(args) {
  const [routeURL, SetrouteURL] = useState("add");
  const [contactsData, setContactsData] = useState([]);
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
          const response = await getContacts(); // Await the asynchronous call

          if (response.status === 200) {
            if (response?.data?.success) {
              setContactsData(response?.data?.data?.contacts); // Assuming `Contacts` contains the roles data
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
        Header: "Contact Info",
        accessor: "contactInfo",
        Cell: ({ row }) => {
          const salutation = row.original.salutation
            ? `${row.original.salutation} `
            : "";
          const firstName = row.original.firstName || "";
          const lastName = row.original.lastName || "";
          const fullName = `${salutation}${firstName} ${lastName}`.trim();

          const emailId = row.original.emailId || "--";

          const countryCode =
            row.original.mobile?.countryCode &&
            row.original.mobile?.countryCode !== "0"
              ? `${row.original.mobile.countryCode}`
              : "";
          const mobile =
            row.original.mobile?.mobileNumber &&
            row.original.mobile?.mobileNumber !== "0"
              ? row.original.mobile.mobileNumber
              : "--";
          const fullMobile = `${countryCode}${mobile}`.trim();

          const whatsCountryCode =
            row.original.whatsApp?.countryCode &&
            row.original.whatsApp?.countryCode !== "0"
              ? `${row.original.whatsApp.countryCode}`
              : "";
          const whatsapp =
            row.original.whatsApp?.whatsAppNumber &&
            row.original.whatsApp?.whatsAppNumber !== "0"
              ? row.original.whatsApp.whatsAppNumber
              : "--";
          const fullWhatsApp = `${whatsCountryCode}${whatsapp}`.trim();

          return (
            <div>
              <div>
                {" "}
                <i
                  className="fa fa-user"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                <strong>{fullName}</strong>
              </div>
              <div>
                <i
                  className="fa fa-envelope"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                {emailId}
              </div>
              <div>
                <i
                  className="fa fa-phone"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                {fullMobile || "--"}
              </div>
              <div>
                <i
                  className="fab fa-whatsapp"
                  style={{ marginRight: 5, color: "green" }}
                ></i>
                {fullWhatsApp !== "--" ? (
                  <Link
                    onClick={() => toggle(fullWhatsApp)}
                    style={{ color: "#25D366" }}
                  >
                    {fullWhatsApp}
                  </Link>
                ) : (
                  "--"
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Company & Website",
        accessor: "companyWebsite",
        Cell: ({ row }) => {
          const companyName = row.original.companyName || "--";
          const website = row.original.website ? (
            <a
              href={formatUrl(row.original.website)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.original.website}
            </a>
          ) : (
            "--"
          );

          return (
            <div>
              <div>
                <i
                  className="fa fa-building"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                {companyName}
              </div>
              <div>
                <i
                  className="fa fa-globe"
                  style={{ marginRight: 5, color: "#D3D3D3" }}
                ></i>
                {website}
              </div>
            </div>
          );
        },
      },
      // {
      //   Header: "Profile Photo",
      //   accessor: "profilePhoto",
      //   Cell: ({ value }) =>
      //     value ? (
      //       <img
      //         src={value}
      //         alt="Profile"
      //         style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      //       />
      //     ) : (
      //       "--"
      //     ),
      // },
      // {
      //   Header: "Business Card",
      //   accessor: "businessCardPhoto",
      //   Cell: ({ value }) =>
      //     value ? (
      //       <img
      //         src={value}
      //         alt="Business Card"
      //         style={{ width: "50px", height: "50px", objectFit: "cover" }}
      //       />
      //     ) : (
      //       "--"
      //     ),
      // },
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
        Header: "Created Date",
        accessor: (row) => formatDateTime(row.createdDate),
      },
      {
        Header: "Action",
        accessor: "edit",
        Cell: ({ row }) => (
          <div className="editIconContainer">
            <Link
              to={`${row.original.contactId}`}
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
        tabletitle={"CONTACTS"}
        columnsData={columnsData}
        tableData={contactsData}
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
        </Modal>
      </div>
    </>
  );
}

export default Contacts;
