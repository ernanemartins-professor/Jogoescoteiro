import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Jogadores (escoteiros)
export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    patrol: text("patrol").notNull(), // pantera | arara | cruzeiro | leao
    points: integer("points").notNull().default(0),
    level: integer("level").notNull().default(1),
    streak: integer("streak").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: uniqueIndex("players_name_patrol_idx").on(table.name, table.patrol),
  }),
);

// Conquistas / medalhas obtidas
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  code: text("code").notNull(), // codigo da medalha
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Progresso por território (categorias completadas)
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").notNull(),
  territory: text("territory").notNull(),
  completed: integer("completed").notNull().default(0),
  correct: integer("correct").notNull().default(0),
  total: integer("total").notNull().default(0),
  meta: jsonb("meta"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Player = typeof players.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type Progress = typeof progress.$inferSelect;
