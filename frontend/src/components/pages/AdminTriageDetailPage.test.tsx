import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AdminTriageDetailPage } from './AdminTriageDetailPage'

const getAdminTriageMock = vi.fn()
const archiveAdminTriageMock = vi.fn()
const restoreAdminTriageMock = vi.fn()
const updateStatusMock = vi.fn()
const updateNotesMock = vi.fn()
const logoutMock = vi.fn()

let currentAdmin: {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'STAFF'
} = {
  id: 'admin-1',
  name: 'Dani',
  email: 'dani@example.com',
  role: 'ADMIN',
}

vi.mock('../../api/triageApi', () => ({
  getAdminTriage: (...args: unknown[]) => getAdminTriageMock(...args),
  archiveAdminTriage: (...args: unknown[]) => archiveAdminTriageMock(...args),
  restoreAdminTriage: (...args: unknown[]) => restoreAdminTriageMock(...args),
  updateAdminTriageStatus: (...args: unknown[]) => updateStatusMock(...args),
  updateAdminTriageInternalNotes: (...args: unknown[]) => updateNotesMock(...args),
}))

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    admin: currentAdmin,
    logout: logoutMock,
  }),
}))

const activeTriage = {
  id: 'triage-1',
  status: 'IN_REVIEW',
  fullName: 'Maria da Rosa',
  age: 42,
  profession: 'Professora',
  whatsapp: '41999999999',
  treatmentReason: 'INJURY_RECOVERY',
  mainComplaint: 'Dor lombar',
  painLocation: 'Lombar',
  painLevel: 4,
  medicalReferral: false,
  physicalActivity: false,
  complementaryExams: false,
  surgery: false,
  metalImplant: false,
  medication: false,
  healthConditions: [],
  consentAccepted: true,
  internalNotes: 'Paciente retornará na próxima semana.',
  archivedAt: null,
  createdAt: '2026-08-21T12:00:00.000Z',
  updatedAt: '2026-08-21T13:00:00.000Z',
  auditLogs: [
    {
      id: 'audit-1',
      action: 'TRIAGE_STATUS_CHANGED',
      details: 'NEW -> IN_REVIEW',
      createdAt: '2026-08-21T13:00:00.000Z',
      actor: {
        name: 'Dani',
        role: 'ADMIN',
      },
    },
  ],
}

const archivedTriage = {
  ...activeTriage,
  archivedAt: '2026-08-21T14:00:00.000Z',
  auditLogs: [
    ...activeTriage.auditLogs,
    {
      id: 'audit-2',
      action: 'TRIAGE_ARCHIVED',
      details: 'Ficha arquivada',
      createdAt: '2026-08-21T14:00:00.000Z',
      actor: {
        name: 'Dani',
        role: 'ADMIN',
      },
    },
  ],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/triagens/triage-1']}>
      <Routes>
        <Route path="/admin/triagens/:id" element={<AdminTriageDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminTriageDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentAdmin = {
      id: 'admin-1',
      name: 'Dani',
      email: 'dani@example.com',
      role: 'ADMIN',
    }

    getAdminTriageMock.mockResolvedValue(activeTriage)
    archiveAdminTriageMock.mockResolvedValue({
      id: 'triage-1',
      archivedAt: '2026-08-21T14:00:00.000Z',
      message: 'Ficha arquivada com sucesso.',
    })
    restoreAdminTriageMock.mockResolvedValue({
      id: 'triage-1',
      archivedAt: null,
      message: 'Ficha restaurada com sucesso.',
    })
    updateStatusMock.mockResolvedValue({})
    updateNotesMock.mockResolvedValue({ internalNotes: activeTriage.internalNotes })
  })

  it('mantém o histórico de alterações recolhido por padrão', async () => {
    const { container } = renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Maria da Rosa', level: 1 }),
    ).toBeInTheDocument()

    const history = container.querySelector('details.admin-history-accordion')
    expect(history).toBeInTheDocument()
    expect(history).not.toHaveAttribute('open')
    expect(screen.getByText('1 registro nesta ficha.')).toBeInTheDocument()
  })

  it('bloqueia status e observações quando a ficha está arquivada', async () => {
    getAdminTriageMock.mockResolvedValue(archivedTriage)
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Maria da Rosa', level: 1 }),
    ).toBeInTheDocument()

    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Salvar observação' })).toBeDisabled()
    expect(
      screen.getByText(/restaure-a para editar as observações/i),
    ).toBeInTheDocument()
  })

  it('exibe a ação de arquivar para administrador em ficha ativa', async () => {
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Maria da Rosa', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /arquivar ficha/i }),
    ).toBeInTheDocument()
  })

  it('não exibe ações de arquivo para equipe STAFF', async () => {
    currentAdmin = {
      id: 'staff-1',
      name: 'Funcionária',
      email: 'staff@example.com',
      role: 'STAFF',
    }

    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Maria da Rosa', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /arquivar ficha/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /restaurar ficha/i }),
    ).not.toBeInTheDocument()
  })

  it('arquiva a ficha após confirmação e recarrega os dados', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    getAdminTriageMock
      .mockResolvedValueOnce(activeTriage)
      .mockResolvedValueOnce(archivedTriage)

    renderPage()

    const archiveButton = await screen.findByRole('button', {
      name: /arquivar ficha/i,
    })

    fireEvent.click(archiveButton)

    await waitFor(() => {
      expect(archiveAdminTriageMock).toHaveBeenCalledWith('triage-1')
    })

    expect(getAdminTriageMock).toHaveBeenCalledTimes(2)
    expect(
      await screen.findByRole('button', { name: /restaurar ficha/i }),
    ).toBeInTheDocument()
  })
})
