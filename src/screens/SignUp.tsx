import { useState } from 'react'
import PrimaryButton from '../Components/PrimaryButton'
import { useNavigate } from 'react-router-dom'

function SignUp() {

  const navigate = useNavigate()

  return (
    <div style={{
      marginBlock: 24,
      marginInline: 64,
      display: 'flex',
      flexDirection: 'column',
      gap: 120
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      

            <div className="justify-center items-center flex-row hidden sm:flex">
              <img src="/logo.png" alt="Logo" className="h-5 w-3" />
              <span className="text-red-600 text-lg font-bold p-0">B</span>
              <span className="text-black/50 text-lg font-bold ">ites.</span>
            </div>

      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 4,
          width: 330
        }}>
          <h1 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'left',
          }}>Welcome To Bites</h1>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 12,
          flexDirection: 'column'
        }}>
          <div style={{ margin: "4px 0", display: "flex", flexDirection: "column", gap: 4, alignItems: 'self-start' }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>
              Email
            </label>
            <input
              type="text"
              placeholder="Enter Your Email"
              style={{
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #ccc",
                width: 330
              }}
            />
          </div>
          <div style={{ margin: "4px 0", display: "flex", flexDirection: "column", gap: 4, alignItems: 'self-start' }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              style={{
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #ccc",
                width: 330
              }}
            />
          </div>
          
          {/* ✅ Navigate to /app when button clicked */}
          <PrimaryButton title='Sign Up' onClick={() => navigate('/app')} />
        </div>
      </div>
    </div>
  )
}

export default SignUp
