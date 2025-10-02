import { createSlice } from "@reduxjs/toolkit";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
  lastUpdated: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdAt: string;
}

export interface InventoryActivity {
  id: string;
  action: string;
  name: string;
  user: string;
  date: string;
  quantity?: string;
}

interface InventoryState {
  items: InventoryItem[];
  categories: InventoryCategory[];
  activities: InventoryActivity[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  categories: [],
  activities: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    fetchInventoryItemsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchInventoryItemsSuccess(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchInventoryItemsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    fetchCategoriesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action) {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchCategoriesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    
    fetchActivitiesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchActivitiesSuccess(state, action) {
      state.activities = action.payload;
      state.loading = false;
    },
    fetchActivitiesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addItemStart(state) {
      state.loading = true;
      state.error = null;
    },
    addItemSuccess(state, action) {
      state.items.push(action.payload);
      state.loading = false;
    },
    addItemFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateItemStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateItemSuccess(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
    },
    updateItemFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteItemStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteItemSuccess(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.loading = false;
    },
    deleteItemFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addCategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    addCategorySuccess(state, action) {
      state.categories.push(action.payload);
      state.loading = false;
    },
    addCategoryFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateCategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateCategorySuccess(state, action) {
      const index = state.categories.findIndex(category => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      state.loading = false;
    },
    updateCategoryFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    deleteCategoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess(state, action) {
      state.categories = state.categories.filter(category => category.id !== action.payload);
      state.loading = false;
    },
    deleteCategoryFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  fetchInventoryItemsStart,
  fetchInventoryItemsSuccess,
  fetchInventoryItemsFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchActivitiesStart,
  fetchActivitiesSuccess,
  fetchActivitiesFailure,
  addItemStart,
  addItemSuccess,
  addItemFailure,
  updateItemStart,
  updateItemSuccess,
  updateItemFailure,
  deleteItemStart,
  deleteItemSuccess,
  deleteItemFailure,
  addCategoryStart,
  addCategorySuccess,
  addCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure
} = inventorySlice.actions;

export default inventorySlice.reducer;