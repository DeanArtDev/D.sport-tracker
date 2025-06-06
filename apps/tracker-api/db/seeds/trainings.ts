import { Kysely } from 'kysely';
import { DB } from '../../src/shared/modules/db/types';

const trainings = [
  {
    type: 'LIGHT',
    name: 'Моя тренировка груди',
    description: 'описание (какие цели на тренировку, на что сделать упор и т.п)',
    worm_up_duration: 30,
    user_id: 1,
    start_date: '2025-05-24T13:01:02.471Z',
    exercises: [
      {
        id: 1,
        sets: 3,
        repetitions: 12,
      },
    ],
  },
  {
    type: 'MEDIUM',
    user_id: 1,
    start_date: '2025-05-24T13:01:02.471Z',
    name: 'Моя тренировка спины',
    description: 'описание (какие цели на тренировку, на что сделать упор и т.п)',
    worm_up_duration: 30,
    post_training_duration: 30,
    exercises: [
      {
        id: 1,
        sets: 3,
        repetitions: 6,
      },
    ],
  },
  {
    type: 'HARD',
    user_id: 1,
    start_date: '2025-05-24T13:01:02.471Z',
    name: 'Моя тренировка ног',
    description: 'описание (какие цели на тренировку, на что сделать упор и т.п)',
    post_training_duration: 30,
    exercises: [
      {
        id: 1,
        sets: 3,
        repetitions: 3,
      },
    ],
  },
];

export default {
  key: 'training',
  target: 'Тренировки пользователя',
  seed: async (db: Kysely<DB>) => {
    await db.transaction().execute(async (trx) => {
      for (const { exercises, ...training } of trainings) {
        const result = await trx
          .insertInto('trainings')
          .values(training)
          .returning(['id'])
          .executeTakeFirstOrThrow();

        await trx
          .insertInto('trainings_exercise_templates')
          .values(
            exercises.map((i, index) => ({
              training_id: result.id,
              exercise_template_id: i.id,
              order: index,
            })),
          )
          .executeTakeFirstOrThrow();
      }

      for (const t of trainings) {
        console.log(`✅ ${t.name} залита успешно`);
      }
    });
  },
};
