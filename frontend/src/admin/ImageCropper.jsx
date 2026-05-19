import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

// Helper: crop the image and return a blob
async function getCroppedBlob(imageSrc, croppedAreaPixels) {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob())
  const canvas = document.createElement('canvas')
  canvas.width  = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(
    image,
    croppedAreaPixels.x, croppedAreaPixels.y,
    croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0,
    croppedAreaPixels.width, croppedAreaPixels.height
  )
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
}

/**
 * ImageCropper
 * Props:
 *   imageSrc   — object URL of selected image
 *   aspect     — crop ratio e.g. 16/9 or 1
 *   onConfirm  — callback(croppedBlob, previewUrl)
 *   onCancel   — callback()
 */
export default function ImageCropper({ imageSrc, aspect, onConfirm, onCancel }) {
  const [crop, setCrop]                     = useState({ x:0, y:0 })
  const [zoom, setZoom]                     = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [saving, setSaving]                 = useState(false)

  const onCropComplete = useCallback((_, cap) => {
    setCroppedAreaPixels(cap)
  }, [])

  const handleConfirm = async () => {
    setSaving(true)
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels)
      const previewUrl = URL.createObjectURL(blob)
      onConfirm(blob, previewUrl)
    } catch (e) {
      alert('Crop failed. Please try again.')
    }
    setSaving(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.7)', zIndex:1100, backdropFilter:'blur(6px)' }} />

      {/* Cropper box */}
      <div style={{
        position:'fixed', inset:0, zIndex:1101,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:16,
      }}>
        <div style={{
          background:'#fff', borderRadius:24, overflow:'hidden',
          width:'100%', maxWidth:520,
          boxShadow:'0 32px 80px rgba(0,0,0,.25)',
        }}>
          {/* Header */}
          <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:16 }}>Crop Image</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                {aspect === 16/9 ? '16:9 ratio (landscape)' : '1:1 ratio (square)'}
              </div>
            </div>
            <button onClick={onCancel} style={{ background:'#f8fafc', border:'1.5px solid #e8ecf4', borderRadius:10, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b', fontSize:'1rem' }}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Crop area */}
          <div style={{ position:'relative', height:280, background:'#1e1b4b' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle:{ borderRadius:0 },
                cropAreaStyle:{ border:'2px solid #6366f1', boxShadow:'0 0 0 9999px rgba(15,23,42,.6)' },
              }}
            />
          </div>

          {/* Zoom slider */}
          <div style={{ padding:'14px 20px 10px', background:'#f8fafc', borderTop:'1px solid #f1f5f9' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <i className="bi bi-zoom-out" style={{ color:'#94a3b8', fontSize:'.85rem' }}></i>
              <input
                type="range" min={1} max={3} step={0.05}
                value={zoom} onChange={e => setZoom(Number(e.target.value))}
                style={{ flex:1, accentColor:'#6366f1', cursor:'pointer' }}
              />
              <i className="bi bi-zoom-in" style={{ color:'#94a3b8', fontSize:'.85rem' }}></i>
            </div>
            <div style={{ textAlign:'center', fontSize:11, color:'#94a3b8', marginTop:4 }}>
              Pinch or scroll to zoom · Drag to reposition
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding:'14px 20px 20px', display:'flex', gap:10 }}>
            <button onClick={onCancel} style={{ flex:1, padding:12, borderRadius:12, border:'1.5px solid #e8ecf4', background:'#f8fafc', fontWeight:700, fontSize:13, cursor:'pointer', color:'#64748b' }}>
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={saving} style={{ flex:2, padding:12, borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#a78bfa)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 12px rgba(99,102,241,.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {saving
                ? <><i className="bi bi-hourglass-split"></i> Applying...</>
                : <><i className="bi bi-check-lg"></i> Confirm Crop</>
              }
            </button>
          </div>
        </div>
      </div>
    </>
  )
}