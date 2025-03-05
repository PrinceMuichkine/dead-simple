import { hatch } from 'ldrs'

hatch.register()

export function LdrHatch() {
    return (
        <l-hatch
            size="28"
            stroke="4"
            speed="3.5"
            color="black"
        ></l-hatch>
    )
}