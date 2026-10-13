const skeleton =
  "rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%] animate-shimmer";

export const HomeCTALoading = () => (
  <div className="flex w-full flex-col gap-4">
    <div className={`${skeleton} mx-auto h-7 w-2/5`} />
    <div className={`${skeleton} h-11 w-full`} />
    <div className={`${skeleton} h-11 w-full`} />
    <div className={`${skeleton} mx-auto h-11 w-1/3`} />

    <hr className="border-slate-200" />

    <div className={`${skeleton} mx-auto h-6 w-3/5`} />
    <div className={`${skeleton} mx-auto h-11 w-2/3`} />
  </div>
);

export const TableLoadingLine = () => (
  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-accent/15">
    <div className="animate-indeterminate absolute inset-y-0 rounded-full bg-accent" />
  </div>
);

export const LoadingPage = () => (
  <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-4 py-8">
    <div className={`${skeleton} h-12 w-2/5`} />
    <div className={`${skeleton} h-7 w-3/5`} />
    <div className={`${skeleton} h-7 w-4/5`} />
    <div className={`${skeleton} h-7 w-[90%]`} />

    <div className={`${skeleton} h-48 w-[70%]`} />

    <div className={`${skeleton} h-9 w-1/2`} />
    <div className={`${skeleton} h-9 w-[70%]`} />
    <div className={`${skeleton} h-9 w-[30%]`} />
  </div>
);
