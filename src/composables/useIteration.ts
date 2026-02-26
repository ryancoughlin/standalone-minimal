import { type InjectionKey, type Ref, inject, provide, ref, readonly } from "vue";

const IterationKey: InjectionKey<Ref<number>> = Symbol("iteration");

export function provideIteration(initial = 1) {
  const iteration = ref(initial);
  provide(IterationKey, iteration);
  return iteration;
}

export function useIteration(): Readonly<Ref<number>> {
  const iteration = inject(IterationKey);
  if (!iteration) return readonly(ref(5));
  return readonly(iteration);
}
