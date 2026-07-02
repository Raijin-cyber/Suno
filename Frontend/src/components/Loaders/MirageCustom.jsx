import { Mirage } from 'ldrs/react'
import 'ldrs/react/Mirage.css'

const MirageCustom = () => {
    return (
       <div className='absolute bottom-0 left-1/2 -translate-x-1/2'>
            <Mirage
                size="60"
                speed="2.5"
                color="#DE3163" 
            />
       </div>
    )
}

export default MirageCustom