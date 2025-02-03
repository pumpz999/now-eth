import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Template {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  version: string;
  downloads: number;
  rating: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateState {
  templates: Template[];
  selectedTemplate: Template | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
};

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setTemplates: (state, action: PayloadAction<Template[]>) => {
      state.templates = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<Template>) => {
      state.selectedTemplate = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setTemplates, setSelectedTemplate, setLoading, setError } =
  templateSlice.actions;

export const selectTemplates = (state: RootState) => state.template.templates;
export const selectSelectedTemplate = (state: RootState) =>
  state.template.selectedTemplate;
export const selectTemplateLoading = (state: RootState) => state.template.loading;
export const selectTemplateError = (state: RootState) => state.template.error;

export default templateSlice.reducer;
