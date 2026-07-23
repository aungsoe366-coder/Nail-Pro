const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const brokenRegex = /\n\s*\)\};\n\s*if \(res && res\.isSaved\) \{[\s\S]*?checkBiometric\(\);\n\s*\}, \[\]\);/m;

const replacement = `
      )}
       </div>
    </div>
  );
};

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-black mb-4">Reset Password</h2>
      <p className="text-muted-foreground mb-4">Password reset is handled via Identity Reset or Admin panel.</p>
      <button onClick={() => window.location.href = '/'} className="mt-4 py-3 px-6 bg-primary text-white rounded-xl font-bold">Back to Login</button>
    </div>
  );
};

const IdentityResetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-black mb-4">Identity Reset</h2>
      <p className="text-muted-foreground mb-4">Please contact an admin to reset your password or identity details.</p>
      <button onClick={() => window.location.href = '/'} className="mt-4 py-3 px-6 bg-primary text-white rounded-xl font-bold">Back to Login</button>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'phone'|'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithPhone, loginWithEmail, loginWithGoogle, error, setError, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [hasBiometric, setHasBiometric] = useState(false);
  
  useEffect(() => {
    const checkBiometric = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const avail = await NativeBiometric.isAvailable();
        if (avail.isAvailable) {
          const res = await NativeBiometric.getCredentials({ server: 'nail-pro-pos' }).catch(() => {
            // Ignore error
          });
          if (res && res.isSaved) {
            setHasBiometric(true);
          }
        }
      } catch (err) {
        console.warn('Biometric check failed:', err);
      } finally {
        try {
          await SplashScreen.hide();
        } catch (e) {
          // ignore
        }
      }
    };
    checkBiometric();
  }, []);
`;

if (brokenRegex.test(code)) {
  code = code.replace(brokenRegex, replacement);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find brokenRegex");
}

