import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { eq, and } from 'drizzle-orm';
import db from '@/db';
import { insertTodoSchema, updateTodoSchema, todos } from '@/schema/todos';
import { uuidSchema } from '@/schema/common';

export const getTodos = async (req: Request, res: Response) => {
  const rows = await db.select().from(todos).where(eq(todos.userId, req.userId));
  return res.status(200).json(rows);
};

export const addTodo = async (req: Request, res: Response) => {
  const newTodo = insertTodoSchema.parse(req.body);
  const rows = await db
    .insert(todos)
    .values({ id: randomUUID(), userId: req.userId, ...newTodo })
    .returning();
  return res.status(201).json(rows[0]);
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = uuidSchema.parse(req.params);
  const updateTodo = updateTodoSchema.parse(req.body);
  const rows = await db
    .update(todos)
    .set({ ...updateTodo })
    .where(and(eq(todos.id, id), eq(todos.userId, req.userId)))
    .returning();
  return res.status(200).json(rows[0]);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = uuidSchema.parse(req.params);
  const rows = await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, req.userId)))
    .returning();
  return res.status(200).json(rows[0]);
};
