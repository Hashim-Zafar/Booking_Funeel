type PillRadioProps<T extends readonly string[]> = {
  name: string;
  options: T;
  value?: T[number];
  onChange: (v: T[number]) => void;
};

export default function PillRadio<T extends readonly string[]>({
  name,
  options,
  value,
  onChange,
}: PillRadioProps<T>) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-5">
      {options.map((opt) => {
        const active = value === opt;

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={[
              // pill shell
              "group inline-flex items-center gap-4",
              "rounded-[16px] border",
              "px-7 py-4", // bigger pill like screenshot
              "text-[15px] font-medium leading-none",
              "transition-colors",
              "bg-black/[0.02] border-black/10 text-black",
              "hover:border-black/20",
              // focus
            ].join(" ")}
          >
            {/* radio dot */}
            <span
              aria-hidden="true"
              className={[
                "h-4 w-4 rounded-full transition-colors",
                active ? "bg-black" : "bg-black/10",
              ].join(" ")}
            />

            <span className="whitespace-nowrap">{opt}</span>
          </button>
        );
      })}

      {/* keeps native form submission semantics */}
      <input type="hidden" name={name} value={value ?? ""} />
    </div>
  );
}
