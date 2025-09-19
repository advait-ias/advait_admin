import api from "../../api/axiosConfig";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import "./dataTable.scss";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  route: string;
  rowCount?: number;
  page?: number;
  pageSize?: number;
  loading?: boolean;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
};

const DataTable = (props: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/${props.slug}/id/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [props.route] });
    },
  });

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      deleteMutation.mutate(id);
    }
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 100,
    renderCell: (params) => (
      <div className="action">
        <Link to={`/${props.slug}/${params.row.id}`}>
          <img src="/view.svg" alt="View" />
        </Link>
        <div className="delete" onClick={() => handleDelete(params.row.id)}>
          <img src="/delete.svg" alt="Delete" />
        </div>
      </div>
    ),
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        rowCount={props.rowCount}
        loading={props.loading} // ✅ spinner overlay
        paginationMode={props.page !== undefined ? "server" : "client"}
        paginationModel={{
          page: props.page ?? 0,
          pageSize: props.pageSize ?? 10,
        }}
        onPaginationModelChange={(model) => {
          props.onPageChange?.(model.page);
          props.onPageSizeChange?.(model.pageSize);
        }}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
