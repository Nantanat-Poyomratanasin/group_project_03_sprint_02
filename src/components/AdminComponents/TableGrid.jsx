import React, { useState, useEffect } from "react";
import { DataGrid, GridRowModes } from "@mui/x-data-grid";

// ==========================================
// 1. API CLIENT & CONFIGURATION
// ==========================================
const API_BASE_URL = "http://localhost:3002/api";

const apiClient = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`GET ${endpoint} failed`);
    return res.json();
  },
  post: async (endpoint, data) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST ${endpoint} failed`);
    return res.json();
  },
  put: async (endpoint, data) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`PUT ${endpoint} failed`);
    return res.json();
  },
  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`DELETE ${endpoint} failed`);
    return true;
  },
};

// ==========================================
// 2. SHARED STYLES & COMPONENTS
// ==========================================
const dataGridStyles = {
  backgroundColor: "white",
  border: "1px solid #000",
  // Ensures header background stretches full width without white gaps
  "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller":
    {
      backgroundColor: "#1e1e1e !important",
      color: "#ffffff !important",
      borderRadius: 0,
    },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#ffffff !important",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-iconButtonContainer svg, & .MuiDataGrid-menuIcon svg, & .MuiDataGrid-sortIcon":
    {
      fill: "#ffffff !important",
      color: "#ffffff !important",
    },
  "& .MuiDataGrid-iconSeparator": { color: "#ffffff !important" },
  "& .MuiCheckbox-root": { color: "inherit" },
  "& .MuiDataGrid-columnHeader .MuiCheckbox-root": {
    color: "#ffffff !important",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #e0e0e0",
    borderRight: "1px solid #e0e0e0",
  },
};

const TableActions = ({
  onAdd,
  onEditOrSave,
  onRemove,
  canEdit,
  canRemove,
  isEditing,
}) => (
  <div className="flex justify-end gap-3 mb-4">
    <button
      onClick={onAdd}
      className="bg-[#1e1e1e] hover:bg-black text-white px-6 py-1.5 rounded-full text-sm font-medium transition-colors"
    >
      Add new
    </button>
    <button
      onClick={onEditOrSave}
      disabled={!canEdit}
      className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${canEdit ? "bg-[#1e1e1e] hover:bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
    >
      {isEditing ? "Save" : "Edit"}
    </button>
    <button
      onClick={onRemove}
      disabled={!canRemove}
      className={`px-6 py-1.5 rounded-full text-sm font-medium transition-colors ${canRemove ? "bg-red-600 hover:bg-red-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
    >
      Remove
    </button>
  </div>
);

// Helper for dates
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

// Helper for Decimal128
const parseDecimal128 = (value) => {
  if (value && value.$numberDecimal !== undefined)
    return Number(value.$numberDecimal);
  return Number(value) || 0;
};

// ==========================================
// 3. PRODUCT CATALOG TABLE
// ==========================================
export function ProductCatalogTable() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/products")
      .then((response) => {
        const actualData = Array.isArray(response)
          ? response
          : response?.data || [];
        setRows(
          actualData.map((item) => ({ ...item, id: item._id || item.id })),
        );
      })
      .catch((err) => {
        console.error(err);
        setRows([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "img_link", headerName: "Image Link", width: 130, editable: true },
    {
      field: "book_name",
      headerName: "Book Name",
      minWidth: 150,
      flex: 1,
      editable: true,
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 150,
      flex: 1,
      editable: true,
    },
    { field: "author", headerName: "Author", width: 130, editable: true },
    { field: "isbn", headerName: "ISBN", width: 130, editable: true },
    { field: "category", headerName: "Category", width: 130, editable: true },
    { field: "publisher", headerName: "Publisher", width: 130, editable: true },
    { field: "language", headerName: "Language", width: 100, editable: true },
    {
      field: "page",
      headerName: "Pages",
      width: 80,
      type: "number",
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      type: "number",
      editable: true,
      valueGetter: parseDecimal128,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 80,
      type: "number",
      editable: true,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 80,
      type: "number",
      editable: true,
    },
    {
      field: "is_highlighted",
      headerName: "Highlighted",
      width: 100,
      type: "boolean",
      editable: true,
    },
    {
      field: "isDiscount",
      headerName: "On Discount",
      width: 100,
      type: "boolean",
      editable: true,
    },
    {
      field: "discountPercent",
      headerName: "Discount %",
      width: 100,
      type: "number",
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      type: "dateTime",
      valueGetter: parseDate,
    },
  ];

  const handleAdd = () => {
    const newId = `temp-${Date.now()}`;
    const newRow = {
      id: newId,
      book_name: "New Book",
      title: "New Title",
      isbn: `ISBN-${Date.now()}`,
      price: 0.0,
      rating: 5,
      img_link: "https://example.com/placeholder.jpg",
      page: 100,
      language: "English",
      publisher: "Self Published",
      stock: 0,
      is_highlighted: false,
      category: "Fiction",
      author: "Unknown Author",
      isDiscount: false,
      discountPercent: 0,
      isNew: true,
    };
    setRows((oldRows) => [newRow, ...oldRows]);
    setSelectedRows({ type: "include", ids: new Set([newId]) });
    setRowModesModel({
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "book_name" },
    });
  };

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
    const ids = Array.from(newSelectionModel.ids);
    setRowModesModel(
      ids.length === 1 ? { [ids[0]]: { mode: GridRowModes.Edit } } : {},
    );
  };

  const handleEditOrSave = () => {
    const ids = Array.from(selectedRows.ids);
    if (ids.length !== 1) return;
    const isEditing = rowModesModel[ids[0]]?.mode === GridRowModes.Edit;
    setRowModesModel({
      ...rowModesModel,
      [ids[0]]: { mode: isEditing ? GridRowModes.View : GridRowModes.Edit },
    });
  };

  const processRowUpdate = async (newRow, oldRow) => {
    const isNew = newRow.isNew;
    const payload = { ...newRow };
    delete payload.isNew;
    if (isNew) delete payload.id;

    try {
      let savedRow;
      if (isNew) {
        const response = await apiClient.post("/products", payload);
        savedRow = { ...response, id: response._id };
        setRows((prevRows) => [
          ...prevRows.filter((r) => r.id !== newRow.id),
          savedRow,
        ]);
      } else {
        const updateId = payload._id || payload.id;
        const response = await apiClient.put(`/products/${updateId}`, payload);
        savedRow = { ...response, id: response._id || response.id };
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? savedRow : row)),
        );
      }
      return savedRow;
    } catch (error) {
      console.error(error);
      return oldRow;
    }
  };

  const handleRemove = async () => {
    try {
      await Promise.all(
        Array.from(selectedRows.ids).map((id) => {
          const actualId = rows.find((r) => r.id === id)?._id || id;
          return apiClient.delete(`/products/${actualId}`);
        }),
      );
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.ids.has(row.id)),
      );
      setSelectedRows({ type: "include", ids: new Set() });
      setRowModesModel({});
    } catch (error) {
      console.error(error);
    }
  };

  const isEditing =
    Array.from(selectedRows.ids).length === 1 &&
    rowModesModel[Array.from(selectedRows.ids)[0]]?.mode === GridRowModes.Edit;

  return (
    <div className="w-full h-[700px] p-6 bg-gray-50 flex flex-col">
      <TableActions
        onAdd={handleAdd}
        onEditOrSave={handleEditOrSave}
        onRemove={handleRemove}
        canEdit={selectedRows.ids.size === 1}
        canRemove={selectedRows.ids.size > 0}
        isEditing={isEditing}
      />
      <div className="flex-grow w-full">
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          sx={dataGridStyles}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleSelectionChange}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
        />
      </div>
    </div>
  );
}

// ==========================================
// 4. USER CATALOG TABLE
// ==========================================
export function UserCatalogTable() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/users")
      .then((response) => {
        const actualData = Array.isArray(response)
          ? response
          : response?.data || [];
        setRows(
          actualData.map((item) => ({
            ...item,
            id: item._id || item.id,
            address_province: item.address?.province || "",
            address_country: item.address?.country || "",
            address_postcode: item.address?.postcode || "",
          })),
        );
      })
      .catch((err) => {
        console.error(err);
        setRows([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "Username",
      minWidth: 130,
      flex: 1,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 180,
      flex: 1.5,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      minWidth: 150,
      flex: 1,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ["user", "admin"],
    },
    { field: "phone", headerName: "Phone", width: 120, editable: true },
    {
      field: "dateOfBirth",
      headerName: "DOB",
      width: 120,
      type: "date",
      editable: true,
      valueGetter: parseDate,
    },
    {
      field: "address_province",
      headerName: "Province",
      width: 130,
      editable: true,
    },
    {
      field: "address_country",
      headerName: "Country",
      width: 100,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      type: "dateTime",
      valueGetter: parseDate,
    },
  ];

  const handleAdd = () => {
    const newId = `temp-${Date.now()}`;
    const newRow = {
      id: newId,
      username: "newuser",
      email: `new${Date.now()}@example.com`,
      password: "SecurePassword123!",
      fullName: "New User",
      role: "user",
      phone: "",
      dateOfBirth: new Date().toISOString().split("T")[0],
      address_province: "",
      address_country: "Thailand",
      isNew: true,
    };
    setRows((oldRows) => [newRow, ...oldRows]);
    setSelectedRows({ type: "include", ids: new Set([newId]) });
    setRowModesModel({
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "username" },
    });
  };

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
    const ids = Array.from(newSelectionModel.ids);
    setRowModesModel(
      ids.length === 1 ? { [ids[0]]: { mode: GridRowModes.Edit } } : {},
    );
  };

  const handleEditOrSave = () => {
    const ids = Array.from(selectedRows.ids);
    if (ids.length !== 1) return;
    const isEditing = rowModesModel[ids[0]]?.mode === GridRowModes.Edit;
    setRowModesModel({
      ...rowModesModel,
      [ids[0]]: { mode: isEditing ? GridRowModes.View : GridRowModes.Edit },
    });
  };

  const processRowUpdate = async (newRow, oldRow) => {
    const isNew = newRow.isNew;
    const payload = {
      ...newRow,
      address: {
        province: newRow.address_province,
        country: newRow.address_country,
        postcode: newRow.address_postcode,
      },
    };
    delete payload.isNew;
    delete payload.address_province;
    delete payload.address_country;
    delete payload.address_postcode;
    if (isNew) delete payload.id;

    try {
      let savedRow;
      if (isNew) {
        const response = await apiClient.post("/users", payload);
        savedRow = {
          ...response,
          id: response._id,
          address_province: response.address?.province || "",
          address_country: response.address?.country || "",
        };
        setRows((prevRows) => [
          ...prevRows.filter((r) => r.id !== newRow.id),
          savedRow,
        ]);
      } else {
        const updateId = payload._id || payload.id;
        const response = await apiClient.put(`/users/${updateId}`, payload);
        savedRow = {
          ...response,
          id: response._id || response.id,
          address_province: response.address?.province || "",
          address_country: response.address?.country || "",
        };
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? savedRow : row)),
        );
      }
      return savedRow;
    } catch (error) {
      console.error(error);
      return oldRow;
    }
  };

  const handleRemove = async () => {
    try {
      await Promise.all(
        Array.from(selectedRows.ids).map((id) => {
          const actualId = rows.find((r) => r.id === id)?._id || id;
          return apiClient.delete(`/users/${actualId}`);
        }),
      );
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.ids.has(row.id)),
      );
      setSelectedRows({ type: "include", ids: new Set() });
      setRowModesModel({});
    } catch (error) {
      console.error(error);
    }
  };

  const isEditing =
    Array.from(selectedRows.ids).length === 1 &&
    rowModesModel[Array.from(selectedRows.ids)[0]]?.mode === GridRowModes.Edit;

  return (
    <div className="w-full h-[500px] p-6 bg-gray-50 flex flex-col">
      <TableActions
        onAdd={handleAdd}
        onEditOrSave={handleEditOrSave}
        onRemove={handleRemove}
        canEdit={selectedRows.ids.size === 1}
        canRemove={selectedRows.ids.size > 0}
        isEditing={isEditing}
      />
      <div className="flex-grow w-full">
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          sx={dataGridStyles}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleSelectionChange}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
        />
      </div>
    </div>
  );
}

// ==========================================
// 5. ORDER MANAGEMENT TABLE
// ==========================================
export function OrderManagementTable() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/orders")
      .then((response) => {
        const actualData = Array.isArray(response)
          ? response
          : response?.data || [];
        setRows(
          actualData.map((item) => ({ ...item, id: item._id || item.id })),
        );
      })
      .catch((err) => {
        console.error(err);
        setRows([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 100, flex: 1 },
    {
      field: "user_id",
      headerName: "User ID",
      minWidth: 100,
      flex: 1,
      editable: true,
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      width: 130,
      type: "number",
      editable: true,
      valueGetter: parseDecimal128,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      editable: true,
      type: "singleSelect",
      valueOptions: ["pending", "paid", "shipped", "completed", "cancelled"],
    },
    {
      field: "itemCount",
      headerName: "Items",
      minwidth: 500,
      flex: 1,
      valueGetter: (params) =>
        params.row.order_item ? params.row.order_item.length : 0,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      type: "dateTime",
      valueGetter: parseDate,
    },
  ];

  const handleAdd = () => {
    const newId = `temp-${Date.now()}`;
    const newRow = {
      id: newId,
      user_id: "60d5ecb54b353c48e42f6b00",
      total_amount: 0.0,
      status: "pending",
      order_item: [
        {
          book_id: "60d5ecb54b353c48e42f6b01",
          book_name: "Placeholder",
          author: "Author",
          quantity: 1,
          price: 0,
          img_link: "link",
        },
      ],
      isNew: true,
    };
    setRows((oldRows) => [newRow, ...oldRows]);
    setSelectedRows({ type: "include", ids: new Set([newId]) });
    setRowModesModel({
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "user_id" },
    });
  };

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
    const ids = Array.from(newSelectionModel.ids);
    setRowModesModel(
      ids.length === 1 ? { [ids[0]]: { mode: GridRowModes.Edit } } : {},
    );
  };

  const handleEditOrSave = () => {
    const ids = Array.from(selectedRows.ids);
    if (ids.length !== 1) return;
    const isEditing = rowModesModel[ids[0]]?.mode === GridRowModes.Edit;
    setRowModesModel({
      ...rowModesModel,
      [ids[0]]: { mode: isEditing ? GridRowModes.View : GridRowModes.Edit },
    });
  };

  const processRowUpdate = async (newRow, oldRow) => {
    const isNew = newRow.isNew;
    const payload = { ...newRow };
    delete payload.isNew;
    if (isNew) delete payload.id;

    try {
      let savedRow;
      if (isNew) {
        const response = await apiClient.post("/orders", payload);
        savedRow = { ...response, id: response._id };
        setRows((prevRows) => [
          ...prevRows.filter((r) => r.id !== newRow.id),
          savedRow,
        ]);
      } else {
        const updateId = payload._id || payload.id;
        const response = await apiClient.put(`/orders/${updateId}`, payload);
        savedRow = { ...response, id: response._id || response.id };
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? savedRow : row)),
        );
      }
      return savedRow;
    } catch (error) {
      console.error(error);
      return oldRow;
    }
  };

  const handleRemove = async () => {
    try {
      await Promise.all(
        Array.from(selectedRows.ids).map((id) => {
          const actualId = rows.find((r) => r.id === id)?._id || id;
          return apiClient.delete(`/orders/${actualId}`);
        }),
      );
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.ids.has(row.id)),
      );
      setSelectedRows({ type: "include", ids: new Set() });
      setRowModesModel({});
    } catch (error) {
      console.error(error);
    }
  };

  const isEditing =
    Array.from(selectedRows.ids).length === 1 &&
    rowModesModel[Array.from(selectedRows.ids)[0]]?.mode === GridRowModes.Edit;

  return (
    <div className="w-full h-[500px] p-6 bg-gray-50 flex flex-col">
      <TableActions
        onAdd={handleAdd}
        onEditOrSave={handleEditOrSave}
        onRemove={handleRemove}
        canEdit={selectedRows.ids.size === 1}
        canRemove={selectedRows.ids.size > 0}
        isEditing={isEditing}
      />
      <div className="flex-grow w-full">
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          sx={dataGridStyles}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleSelectionChange}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
        />
      </div>
    </div>
  );
}

// ==========================================
// 6. COUPON CODE TABLE
// ==========================================
export function CouponCodeTable() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/coupons")
      .then((response) => {
        const actualData = Array.isArray(response)
          ? response
          : response?.data || [];
        setRows(
          actualData.map((item) => ({ ...item, id: item._id || item.id })),
        );
      })
      .catch((err) => {
        console.error(err);
        setRows([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "code",
      headerName: "Code",
      minWidth: 130,
      flex: 1,
      editable: true,
    },
    {
      field: "discountType",
      headerName: "Type",
      width: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: ["percentage", "fixed"],
    },
    {
      field: "discountValue",
      headerName: "Value",
      width: 100,
      type: "number",
      editable: true,
    },
    {
      field: "minOrderAmount",
      headerName: "Min Order",
      width: 120,
      type: "number",
      editable: true,
    },
    {
      field: "maxDiscountAmount",
      headerName: "Max Discount",
      width: 120,
      type: "number",
      editable: true,
    },
    {
      field: "expiresAt",
      headerName: "Expires At",
      width: 130,
      type: "date",
      editable: true,
      valueGetter: parseDate,
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 90,
      type: "boolean",
      editable: true,
    },
    {
      field: "usageLimit",
      headerName: "Usage Limit",
      width: 120,
      type: "number",
      editable: true,
    },
    {
      field: "usedCount",
      headerName: "Used Count",
      width: 120,
      type: "number",
      editable: true,
    },
  ];

  const handleAdd = () => {
    const newId = `temp-${Date.now()}`;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const newRow = {
      id: newId,
      code: `NEWCODE${Math.floor(Math.random() * 1000)}`,
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: null,
      expiresAt: nextMonth.toISOString().split("T")[0],
      isActive: true,
      usageLimit: null,
      usedCount: 0,
      isNew: true,
    };
    setRows((oldRows) => [newRow, ...oldRows]);
    setSelectedRows({ type: "include", ids: new Set([newId]) });
    setRowModesModel({
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "code" },
    });
  };

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedRows(newSelectionModel);
    const ids = Array.from(newSelectionModel.ids);
    setRowModesModel(
      ids.length === 1 ? { [ids[0]]: { mode: GridRowModes.Edit } } : {},
    );
  };

  const handleEditOrSave = () => {
    const ids = Array.from(selectedRows.ids);
    if (ids.length !== 1) return;
    const isEditing = rowModesModel[ids[0]]?.mode === GridRowModes.Edit;
    setRowModesModel({
      ...rowModesModel,
      [ids[0]]: { mode: isEditing ? GridRowModes.View : GridRowModes.Edit },
    });
  };

  const processRowUpdate = async (newRow, oldRow) => {
    const isNew = newRow.isNew;
    const payload = { ...newRow };
    delete payload.isNew;
    if (isNew) delete payload.id;

    try {
      let savedRow;
      if (isNew) {
        const response = await apiClient.post("/coupons", payload);
        savedRow = { ...response, id: response._id };
        setRows((prevRows) => [
          ...prevRows.filter((r) => r.id !== newRow.id),
          savedRow,
        ]);
      } else {
        const updateId = payload._id || payload.id;
        const response = await apiClient.put(`/coupons/${updateId}`, payload);
        savedRow = { ...response, id: response._id || response.id };
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === newRow.id ? savedRow : row)),
        );
      }
      return savedRow;
    } catch (error) {
      console.error(error);
      return oldRow;
    }
  };

  const handleRemove = async () => {
    try {
      await Promise.all(
        Array.from(selectedRows.ids).map((id) => {
          const actualId = rows.find((r) => r.id === id)?._id || id;
          return apiClient.delete(`/coupons/${actualId}`);
        }),
      );
      setRows((prevRows) =>
        prevRows.filter((row) => !selectedRows.ids.has(row.id)),
      );
      setSelectedRows({ type: "include", ids: new Set() });
      setRowModesModel({});
    } catch (error) {
      console.error(error);
    }
  };

  const isEditing =
    Array.from(selectedRows.ids).length === 1 &&
    rowModesModel[Array.from(selectedRows.ids)[0]]?.mode === GridRowModes.Edit;

  return (
    <div className="w-full h-[500px] p-6 bg-gray-50 flex flex-col">
      <TableActions
        onAdd={handleAdd}
        onEditOrSave={handleEditOrSave}
        onRemove={handleRemove}
        canEdit={selectedRows.ids.size === 1}
        canRemove={selectedRows.ids.size > 0}
        isEditing={isEditing}
      />
      <div className="flex-grow w-full">
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          sx={dataGridStyles}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={handleSelectionChange}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
        />
      </div>
    </div>
  );
}
