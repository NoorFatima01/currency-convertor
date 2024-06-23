import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "Ser No.", width: 70 },
  { field: "from", headerName: "From", width: 130 },
  { field: "to", headerName: "To", width: 130 },
  { field: "amount", headerName: "Amount", width: 130 },
  { field: "convertedAmount", headerName: "Converted Amount", width: 130 },
  { field: "date", headerName: "Date", width: 130 },
];

type HistoryTableProps = {
  rows: unknown[];
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  rowCount: number;
};

export default function HistoryTable({
  rows,
  page,
  pageSize,
  setPage,
  setPageSize,
  rowCount,
}: HistoryTableProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (params: any) => {
    setPage(params.page);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageSizeChange = (params: any) => {
    setPageSize(params.pageSize);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          handlePageChange(model);
          handlePageSizeChange(model);
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}
