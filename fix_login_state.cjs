const fs = require('fs');
let code = fs.readFileSync('src/AppCore.tsx', 'utf8');

const regex = /const LoginPage: React\.FC = \(\) => \{[\s\S]*?const navigate = useNavigate\(\);/m;

const replacement = `const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'phone'|'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [viewState, setViewState] = useState<'login'|'signup'>('login');
  const [signUpMethod, setSignUpMethod] = useState<'phone'|'email'>('phone');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpDob, setSignUpDob] = useState('');
  const [signUpShowPassword, setSignUpShowPassword] = useState(false);
  
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginWithPhone, loginWithEmail, loginWithGoogle, signUpWithPhone, signUp, login, error, setError, user, profile, loading, isCustomer } = useAuth();
  const navigate = useNavigate();`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/AppCore.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find regex");
}
