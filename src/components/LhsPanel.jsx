import React from 'react'
import { reactToDom, reactToDomWithStyles} from '../utils/reactToDom'
import '../css/LhsPanel.css'

const LhsPanel = () => {
    return (
        <div className="lhs-panel-3d part-container">
            <div className="lhs-panel-container">
                <div className='info-container'>
                    <div className='photo-container'>
                        <img src="/an_projects.png" alt="photo" className='photo-img' />
                    </div>
                    <div className='inner-info-container'>
                        <div className='inner-basic-info-container tw:flex-auto tw:justify-between'>
                            <div className='inner-basic-info-title-container'>
                                <div className='title tw:font-geo tw:text-3xl tw:leading-none tw:tracking-tighter'>Rin</div>
                                <div className='subtitle tw:font-mono tw:text-xs tw:leading-none tw:tracking-tighter'>47283</div>
                            </div>
                            
                            <div className='info-line tw:mt-12'>
                                <div className='info-line-title tw:font-mono tw:text-xs tw:leading-none tw:tracking-tighter'>- Product Manager</div>
                                <div className='info-line-title tw:font-mono tw:text-xs tw:leading-none tw:tracking-tighter'>- Software Developer</div>
                                <div className='info-line-title tw:font-mono tw:text-xs tw:leading-none tw:tracking-tighter'>- Entrepreneur Enthusiast</div>
                            </div>
                        </div>
                        {/* <div className='inner-detail-info-container tw:mt-5'>
                            <div className='info-line tw:font-mono tw:text-base'></div>
                        </div> */}
                    </div>
                </div>
                <div className='notice-container tw:py-1 tw:bg-red-900 tw:w-full tw:align-middle tw:justify-center tw:flex'>
                    <div className='tw:font-geo tw:text-sm tw:leading-none tw:tracking-tighter tw:text-white'>Can be easily captured with good food</div>
                </div>
            </div>
        </div>
    )
}

// DOM element version using reactToDom utility
export const createLhsPanelDom = () => {
    return reactToDom(LhsPanel)
  }
  
  // Async version that properly handles styled-jsx
  export const createLhsPanelDomAsync = async () => {
    return await reactToDomWithStyles(LhsPanel)
  }
  
  export default LhsPanel 