import { DataGrid, GridColDef } from "@mui/x-data-grid";
const columns: GridColDef[] = [
  { field: "id", headerName: "Ser No.", width: 70 },
  { field: "from", headerName: "From", width: 130 },
  { field: "to", headerName: "To", width: 130 },
  { field: "amount", headerName: "Amount", width: 130 },
  { field: "convertedAmount", headerName: "Converted Amount", width: 130 },
  { field: "date", headerName: "Date", width: 130 },
];

type historyTableProps = {
  rows: unknown[];
};

export default function HistoryTable({ rows }: historyTableProps) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}
