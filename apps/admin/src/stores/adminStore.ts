import { create } from 'zustand';

interface AdminState {
  // Active tabs per page
  usersTab: string;
  productsTab: string;
  aiMonitorTab: string;
  apiManagementTab: string;
  dataPipelineTab: string;
  settingsTab: string;

  // Set tab actions
  setUsersTab: (tab: string) => void;
  setProductsTab: (tab: string) => void;
  setAiMonitorTab: (tab: string) => void;
  setApiManagementTab: (tab: string) => void;
  setDataPipelineTab: (tab: string) => void;
  setSettingsTab: (tab: string) => void;

  // Selected items for bulk actions
  selectedUserIds: string[];
  selectedProductIds: string[];
  toggleUserSelection: (id: string) => void;
  toggleProductSelection: (id: string) => void;
  selectAllUsers: (ids: string[]) => void;
  selectAllProducts: (ids: string[]) => void;
  clearUserSelection: () => void;
  clearProductSelection: () => void;

  // Modal states
  activeModal: string | null;
  modalData: any;
  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Active tabs - default values
  usersTab: '사용자 목록',
  productsTab: '제품 목록',
  aiMonitorTab: '개요',
  apiManagementTab: 'API Key',
  dataPipelineTab: '개요',
  settingsTab: '공지사항',

  // Set tab actions
  setUsersTab: (tab) => set({ usersTab: tab }),
  setProductsTab: (tab) => set({ productsTab: tab }),
  setAiMonitorTab: (tab) => set({ aiMonitorTab: tab }),
  setApiManagementTab: (tab) => set({ apiManagementTab: tab }),
  setDataPipelineTab: (tab) => set({ dataPipelineTab: tab }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),

  // Selected items
  selectedUserIds: [],
  selectedProductIds: [],

  toggleUserSelection: (id) =>
    set((state) => ({
      selectedUserIds: state.selectedUserIds.includes(id)
        ? state.selectedUserIds.filter((uid) => uid !== id)
        : [...state.selectedUserIds, id],
    })),

  toggleProductSelection: (id) =>
    set((state) => ({
      selectedProductIds: state.selectedProductIds.includes(id)
        ? state.selectedProductIds.filter((pid) => pid !== id)
        : [...state.selectedProductIds, id],
    })),

  selectAllUsers: (ids) =>
    set((state) => ({
      selectedUserIds:
        state.selectedUserIds.length === ids.length ? [] : [...ids],
    })),

  selectAllProducts: (ids) =>
    set((state) => ({
      selectedProductIds:
        state.selectedProductIds.length === ids.length ? [] : [...ids],
    })),

  clearUserSelection: () => set({ selectedUserIds: [] }),
  clearProductSelection: () => set({ selectedProductIds: [] }),

  // Modal states
  activeModal: null,
  modalData: null,

  openModal: (modal, data = null) =>
    set({ activeModal: modal, modalData: data }),

  closeModal: () => set({ activeModal: null, modalData: null }),
}));
