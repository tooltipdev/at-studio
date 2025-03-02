import { ComboBox } from "@/components/ui/shadcn/combo-box"
import schemaMap from "@/services/bsky-sdk/lexicon-zod-schemas"

function MethodSelect({onSelect}: {onSelect: (s:string) => void | Promise<void>}) {
    return <ComboBox onSelect={onSelect} optionLabel="SDK Method" options={Object.keys(schemaMap).sort().map((k: string) => ({value: k, label: k}))}/>
}

export default MethodSelect