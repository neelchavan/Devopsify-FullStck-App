import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import * as api from '../api';

vi.mock('../api');

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.getTodos.mockResolvedValue([]);
    });

    it('renders todo list title', async () => {
        render(<App />);
        expect(screen.getByText('Todos')).toBeInTheDocument();
    });

    it('fetches and displays todos', async () => {
        const todos = [
            { id: '1', title: 'Buy milk', completed: false },
            { id: '2', title: 'Walk dog', completed: true },
        ];
        api.getTodos.mockResolvedValue(todos);

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Buy milk')).toBeInTheDocument();
            expect(screen.getByText('Walk dog')).toBeInTheDocument();
        });
    });

    it('adds a new todo', async () => {
        api.getTodos.mockResolvedValue([]);
        api.createTodo.mockResolvedValue({ id: '3', title: 'New task', completed: false });

        render(<App />);

        const input = screen.getByPlaceholderText('New todo');
        const button = screen.getByText('Add');

        fireEvent.change(input, { target: { value: 'New task' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(api.createTodo).toHaveBeenCalledWith('New task');
            expect(screen.getByText('New task')).toBeInTheDocument();
        });
    });

    it('deletes a todo', async () => {
        const todos = [{ id: '1', title: 'Delete me', completed: false }];
        api.getTodos.mockResolvedValue(todos);
        api.deleteTodo.mockResolvedValue(true);

        render(<App />);

        await waitFor(() => expect(screen.getByText('Delete me')).toBeInTheDocument());

        const deleteBtn = screen.getByText('Delete');
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(api.deleteTodo).toHaveBeenCalledWith('1');
            expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
        });
    });
});
