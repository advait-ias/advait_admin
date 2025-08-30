import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../../api/services/userService";
import "./users.scss";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "img",
    headerName: "Avatar",
    width: 75,
    renderCell: () => <img src={"/noavatar.png"} alt="" />,
  },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
  },
  {
    field: "isActive",
    headerName: "Active",
    type: "boolean",
    width: 200,
  },
];

const Users = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const formattedData =
    data?.map((user: any, index: number) => ({
      id: user._id || index,
      mobileNumber: user.mobileNumber,
      createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
      isVerified: user.isVerified,
    })) || [];

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug="user"
          route="users"
          columns={columns}
          rows={formattedData}
        />
      )}
    </div>
  );
};

export default Users;
