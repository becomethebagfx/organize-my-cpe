import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // Selected states
  selectedStates: string[]
  setSelectedStates: (states: string[]) => void
  toggleState: (stateCode: string) => void

  // Upload progress
  uploadProgress: Record<string, number>
  setUploadProgress: (fileId: string, progress: number) => void
  clearUploadProgress: () => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Selected states
      selectedStates: [],
      setSelectedStates: (states) => set({ selectedStates: states }),
      toggleState: (stateCode) =>
        set((state) => ({
          selectedStates: state.selectedStates.includes(stateCode)
            ? state.selectedStates.filter((s) => s !== stateCode)
            : [...state.selectedStates, stateCode],
        })),

      // Upload progress
      uploadProgress: {},
      setUploadProgress: (fileId, progress) =>
        set((state) => ({
          uploadProgress: { ...state.uploadProgress, [fileId]: progress },
        })),
      clearUploadProgress: () => set({ uploadProgress: {} }),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'cpe-storage',
      partialize: (state) => ({
        selectedStates: state.selectedStates,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Course records store (separate for better performance)
interface CourseState {
  courses: CourseRecord[]
  setCourses: (courses: CourseRecord[]) => void
  updateCourse: (id: string, data: Partial<CourseRecord>) => void
  deleteCourse: (id: string) => void
  deleteMultiple: (ids: string[]) => void
}

interface CourseRecord {
  id: string
  providerName: string | null
  courseTitle: string
  completionDate: Date
  deliveryMethod: string
  fieldOfStudy: string | null
  credits: number
  sponsorId: string | null
  certificateNumber: string | null
  confidence: number
  needsReview: boolean
  documentId: string | null
}

export const useCourseStore = create<CourseState>()((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  updateCourse: (id, data) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  deleteCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    })),
  deleteMultiple: (ids) =>
    set((state) => ({
      courses: state.courses.filter((c) => !ids.includes(c.id)),
    })),
}))
