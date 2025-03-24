import React from "react";
import { Table } from "reactstrap";

function ProjectTables({ projectsData }) {
  return (
    <div>
      {projectsData.map((project) => {
        // Collect unique lead status types for this project
        const allStatuses = new Set();
        project.services.forEach((service) => {
          service.leadStatus.forEach((status) => {
            allStatuses.add(status.leadStatus);
          });
        });

        const statusList = Array.from(allStatuses); // Convert Set to Array

        return (
          <div key={project.projectId} style={{ marginBottom: "20px" }}>
            <h5 style={{ marginTop: "0px" }}>
              <i className="nc-icon nc-chart-bar-32 text-primary" />{" "}
              <strong>{project.projectName}</strong>
            </h5>
            <Table bordered striped>
              <thead>
                <tr>
                  <th className="tableHeader">Service</th>
                  {statusList.map((status) => (
                    <th key={status} className="tableHeader center">
                      {status}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.services.map((service) => {
                  // Create an object to store lead counts by status
                  const leadCountMap = {};
                  service.leadStatus.forEach((status) => {
                    leadCountMap[status.leadStatus] = status.leadCount;
                  });

                  return (
                    <tr key={service.serviceId}>
                      <td>
                        {" "}
                        <strong>{service.serviceName}</strong>
                      </td>
                      {statusList.map((status) => (
                        <td key={status} className="center">
                          {leadCountMap[status] || "-"}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectTables;
