import { type InjectionKey, type Ref, inject, provide, ref, readonly } from "vue";

const SprintKey: InjectionKey<Ref<number>> = Symbol("sprint");

export function provideSprint(initial = 1) {
  const sprint = ref(initial);
  provide(SprintKey, sprint);
  return sprint;
}

export function useSprint(): Readonly<Ref<number>> {
  const sprint = inject(SprintKey);
  if (!sprint) return readonly(ref(4));
  return readonly(sprint);
}
