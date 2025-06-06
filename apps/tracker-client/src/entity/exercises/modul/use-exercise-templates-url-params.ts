import { useUrlQuery } from '@/shared/lib/react/use-url-query';
import { z } from 'zod';

const schema = z.object({ my: z.boolean({ coerce: true }).optional() });

function useExerciseTemplatesUrlParams() {
  type TSchema = z.infer<typeof schema>;

  const [search, setSearch] = useUrlQuery<TSchema>(schema);

  return {
    isMy: Boolean(search?.my),
    search,
    setSearch: (data: TSchema) =>
      data.my === true ? setSearch({ my: data.my }) : setSearch({ my: undefined }),
  };
}

export { useExerciseTemplatesUrlParams };
