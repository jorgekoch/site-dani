import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AdminArchivePage } from './AdminArchivePage'

const listArchivedTriagesMock = vi.fn()
const restoreAdminTriageMock = vi.fn()
const adminLogoutMock = vi.fn()

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
  listArchivedTriages: (...args: unknown[]) => listArchivedTriagesMock(...args),
  restoreAdminTriage: (...args: unknown[]) => restoreAdminTriageMock(...args),
}))

vi.mock('../../api/authApi', () => ({
  adminLogout: (...args: unknown[]) => adminLogoutMock(...args),
}))

vi.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    admin: currentAdmin,
  }),
}))

const archivedItems = [
  {
    id: 'triage-2026',
    status: 'COMPLETED',
    fullName: 'Maria da Rosa',
    age: 42,
    profession: 'Professora',
    whatsapp: '41999999999',
    mainComplaint: 'Dor lombar',
    painLocation: 'Lombar',
    painLevel: 4,
    treatmentReason: 'INJURY_RECOVERY',
    archivedAt: '2026-08-21T12:00:00.000Z',
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-21T12:00:00.000Z',
  },
  {
    id: 'triage-2025',
    status: 'COMPLETED',
    fullName: 'Ana Souza',
    age: 35,
    profession: 'Arquiteta',
    whatsapp: '41988888888',
    mainComplaint: 'Dor no ombro',
    painLocation: 'Ombro',
    painLevel: 3,
    treatmentReason: 'HEALTH_MAINTENANCE',
    archivedAt: '2025-11-10T12:00:00.000Z',
    createdAt: '2025-10-01T12:00:00.000Z',
    updatedAt: '2025-11-10T12:00:00.000Z',
  },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminArchivePage />
    </MemoryRouter>,
  )
}

describe('AdminArchivePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentAdmin = {
      id: 'admin-1',
      name: 'Dani',
      email: 'dani@example.com',
      role: 'ADMIN',
    }

    listArchivedTriagesMock.mockResolvedValue(archivedItems)
    restoreAdminTriageMock.mockResolvedValue({
      id: 'triage-2026',
      archivedAt: null,
      message: 'Ficha restaurada com sucesso.',
    })
  })

  it('carrega as fichas e agrupa o arquivo por ano', async () => {
    renderPage()

    expect(await screen.findByText('Maria da Rosa')).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()

    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()

    const overview = screen.getByRole('region', { name: /resumo do arquivo/i })
    expect(within(overview).getByText('2')).toBeInTheDocument()
    expect(within(overview).getByText('fichas arquivadas')).toBeInTheDocument()

    expect(listArchivedTriagesMock).toHaveBeenCalledTimes(1)
  })

  it('filtra fichas arquivadas pela busca', async () => {
    const user = userEvent.setup()
    renderPage()

    await screen.findByText('Maria da Rosa')

    await user.type(
      screen.getByRole('textbox', { name: /buscar ficha arquivada/i }),
      'Ana Souza',
    )

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
    expect(screen.queryByText('Maria da Rosa')).not.toBeInTheDocument()

    const resultsSummary = document.querySelector('.archive-results-summary')
    expect(resultsSummary).not.toBeNull()
    expect(resultsSummary).toHaveTextContent('1 ficha encontrada')
  })

  it('exibe a ação de restaurar para administrador', async () => {
    renderPage()

    await screen.findByText('Maria da Rosa')

    expect(
      screen.getAllByRole('button', { name: 'Restaurar' }),
    ).toHaveLength(2)
  })

  it('não exibe a ação de restaurar para equipe STAFF', async () => {
    currentAdmin = {
      id: 'staff-1',
      name: 'Funcionária',
      email: 'staff@example.com',
      role: 'STAFF',
    }

    renderPage()

    await screen.findByText('Maria da Rosa')

    expect(
      screen.queryByRole('button', { name: 'Restaurar' }),
    ).not.toBeInTheDocument()
  })

  it('restaura uma ficha após confirmação', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderPage()

    await screen.findByText('Maria da Rosa')

    const restoreButtons = screen.getAllByRole('button', { name: 'Restaurar' })
    fireEvent.click(restoreButtons[0])

    await waitFor(() => {
      expect(restoreAdminTriageMock).toHaveBeenCalledWith('triage-2026')
      expect(screen.queryByText('Maria da Rosa')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
  })
})
