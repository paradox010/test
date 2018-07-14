import './index.css';

const NavLabel = ({text, elseOpt}) => (
    <div className='navlabel-label'>
        <span className='navlabel-span1'></span>
        {text}
        {
            elseOpt?<span className='navlabel-span2'>
                {elseOpt}
            </span>:null
        }
    </div>
)

export default NavLabel
