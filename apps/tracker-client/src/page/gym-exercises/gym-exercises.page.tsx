import {
  useExerciseTemplateDelete,
  useExerciseTemplatesQuery,
  useExerciseTemplatesUrlParams,
  useInvalidateExerciseTemplates,
} from '@/entity/exercises';
import { ManageExerciseTemplate } from '@/feature/exercise/manage-exercise-template';
import { ExerciseCard } from './ui/exercise-card';
import { ExercisePreview } from './ui/exercise-preview';
import type { ApiDto } from '@/shared/api/types';
import { DataLoader } from '@/shared/ui-kit/ui/data-loader';
import { Toggle } from '@/shared/ui-kit/ui/toggle';
import { cn } from '@/shared/ui-kit/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { PageWrapper } from '../ui/page-wrapper';

function GymExercisesPage() {
  const { isMy, setSearch } = useExerciseTemplatesUrlParams();
  const invalidate = useInvalidateExerciseTemplates();
  const { data, isLoading, isFetching, isEmpty } = useExerciseTemplatesQuery({ my: isMy });

  const [exerciseTemplate, setExerciseTemplate] = useState<
    ApiDto['ExerciseTemplateDto'] | undefined
  >();
  const [openPreview, setOpenPreview] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const { deleteTrigger, isPending } = useExerciseTemplateDelete();

  return (
    <PageWrapper
      className={cn('grow gap-4 lg:gap-8', {
        'overflow-hidden': isLoading,
      })}
    >
      <div className="flex flex-col grow gap-4">
        <div className="flex">
          <Toggle
            pressed={isMy}
            disabled={isFetching}
            size="sm"
            variant="outline"
            aria-label="мои упражнения"
            className="text-xs"
            onPressedChange={(value) => void setSearch({ my: value })}
          >
            Мои
          </Toggle>

          <ManageExerciseTemplate
            open={openEdit}
            size="sm"
            exerciseTemplate={exerciseTemplate}
            className="ml-auto"
            variant="outline"
            onOpenChange={setOpenEdit}
            onSuccess={() => {
              setOpenEdit(false);
              invalidate();
            }}
          >
            <Plus /> Создать
          </ManageExerciseTemplate>
        </div>

        <DataLoader
          parallelMount
          isLoading={isLoading}
          isEmpty={isEmpty}
          emptyElement={
            <div className="border-2 border-dotted rounded-lg grow p-2 m-4 flex flex-col justify-center items-center">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center mb-4">
                {isMy ? 'Созданных тобой упражнений пока нет' : 'Упражнения не найдены'}
              </h3>
            </div>
          }
        >
          <div
            className={cn('grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3')}
          >
            {data?.map((exercise) => {
              return (
                <ExerciseCard
                  key={exercise.id}
                  name={exercise.name}
                  exampleUrl={exercise.exampleUrl}
                  onMoreInfoClick={() => {
                    setOpenPreview(true);
                    setExerciseTemplate(exercise);
                  }}
                />
              );
            })}
          </div>
        </DataLoader>

        <ExercisePreview
          open={openPreview}
          loading={isPending}
          exerciseId={exerciseTemplate?.id}
          onEdit={(value) => {
            setExerciseTemplate(value);
            setOpenEdit(true);
          }}
          onDelete={() => {
            if (exerciseTemplate == null) return;
            void deleteTrigger(
              { params: { path: { templateId: exerciseTemplate?.id } } },
              { onSuccess: () => void setOpenPreview(false) },
            );
          }}
          onOpenChange={(value) => {
            if (!value) setExerciseTemplate(undefined);
            setOpenPreview(value);
          }}
        />
      </div>
    </PageWrapper>
  );
}

export const Component = GymExercisesPage;
