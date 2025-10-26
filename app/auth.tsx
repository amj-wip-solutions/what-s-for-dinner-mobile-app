import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import {
  YStack,
  XStack,
  Input,
  Button,
  H1,
  H4,
  Label,
  Card,
  Separator,
  Paragraph
} from 'tamagui'
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock } from '@tamagui/lucide-icons'
import { useAuth } from '../contexts/AuthContext'

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { signIn, signUp, loading } = useAuth()

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate password strength (minimum 6 characters for Supabase)
  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (emailError) setEmailError('')
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (passwordError) setPasswordError('')
  }

  const handleSubmit = async () => {
    // Reset errors
    setEmailError('')
    setPasswordError('')

    // Validate inputs
    let hasError = false

    if (!email.trim()) {
      setEmailError('Email is required')
      hasError = true
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      hasError = true
    }

    if (!password.trim()) {
      setPasswordError('Password is required')
      hasError = true
    } else if (!isLogin && !validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters')
      hasError = true
    }

    if (hasError) return

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      // More user-friendly error messages
      const errorMessage = error.message?.toLowerCase() || ''
      if (errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.')
      } else if (errorMessage.includes('email') && errorMessage.includes('already')) {
        Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.')
      } else {
        Alert.alert('Error', error.message || 'Authentication failed. Please try again.')
      }
    } else if (!isLogin) {
      Alert.alert(
        'Success! 🎉',
        'Your account has been created! Please check your email to verify your account before signing in.',
        [{ text: 'OK', onPress: () => {
          setIsLogin(true)
          setEmail('')
          setPassword('')
        }}]
      )
    }
    // If login succeeds, the AuthContext will handle navigation automatically
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setEmail('')
    setPassword('')
    setEmailError('')
    setPasswordError('')
    setShowPassword(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <YStack f={1} bg="$background" justifyContent="center" p="$5" gap="$6">
          {/* Header Section */}
          <YStack alignItems="center" gap="$3">
            <H1 color="$color" size="$10" fontWeight="700">
              What's For Dinner
            </H1>
            <H4 fontWeight="400" color="$gray11">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </H4>
          </YStack>

          {/* Auth Form Card */}
          <Card elevate size="$4" bordered p="$5" backgroundColor="$background">
            <YStack gap="$4">
              {/* Email Input */}
              <YStack gap="$2.5">
                <Label htmlFor="email" size="$3" fontWeight="600" color="$color">
                  Email Address
                </Label>
                <XStack
                  borderWidth={1}
                  borderColor={emailError ? '$red8' : '$borderColor'}
                  borderRadius="$4"
                  alignItems="center"
                  paddingHorizontal="$3"
                  backgroundColor="$background"
                  focusStyle={{
                    borderColor: emailError ? '$red8' : '$blue8'
                  }}
                >
                  <Mail size={20} color="$gray10" />
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChangeText={handleEmailChange}
                    size="$4"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    borderWidth={0}
                    f={1}
                    backgroundColor="transparent"
                    onSubmitEditing={() => {}}
                  />
                </XStack>
                {emailError ? (
                  <Paragraph color="$red10" fontSize="$2" paddingLeft="$2">
                    {emailError}
                  </Paragraph>
                ) : null}
              </YStack>

              {/* Password Input */}
              <YStack gap="$2.5">
                <Label htmlFor="password" size="$3" fontWeight="600" color="$color">
                  Password
                </Label>
                <XStack
                  borderWidth={1}
                  borderColor={passwordError ? '$red8' : '$borderColor'}
                  borderRadius="$4"
                  alignItems="center"
                  paddingHorizontal="$3"
                  backgroundColor="$background"
                  focusStyle={{
                    borderColor: passwordError ? '$red8' : '$blue8'
                  }}
                >
                  <Lock size={20} color="$gray10" />
                  <Input
                    id="password"
                    placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                    value={password}
                    onChangeText={handlePasswordChange}
                    size="$4"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    borderWidth={0}
                    f={1}
                    backgroundColor="transparent"
                    onSubmitEditing={handleSubmit}
                  />
                  <Button
                    size="$2"
                    chromeless
                    icon={showPassword ? EyeOff : Eye}
                    onPress={() => setShowPassword(!showPassword)}
                    circular
                  />
                </XStack>
                {passwordError ? (
                  <Paragraph color="$red10" fontSize="$2" paddingLeft="$2">
                    {passwordError}
                  </Paragraph>
                ) : !isLogin && !passwordError ? (
                  <Paragraph color="$gray10" fontSize="$2" paddingLeft="$2">
                    Password must be at least 6 characters
                  </Paragraph>
                ) : null}
              </YStack>

              {/* Submit Button */}
              <Button
                size="$5"
                backgroundColor="$blue10"
                color="white"
                onPress={handleSubmit}
                disabled={loading}
                icon={loading ? undefined : (isLogin ? LogIn : UserPlus)}
                mt="$3"
                fontWeight="600"
                pressStyle={{
                  backgroundColor: '$blue9'
                }}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </YStack>
          </Card>

          {/* Toggle between login/signup */}
          <YStack alignItems="center" gap="$4">
            <Separator />
            <XStack alignItems="center" gap="$2" flexWrap="wrap" justifyContent="center">
              <Paragraph size="$3" color="$gray11">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Paragraph>
              <Button
                size="$3"
                variant="outlined"
                onPress={toggleMode}
                disabled={loading}
                color="$blue10"
                borderColor="$blue10"
                fontWeight="600"
                pressStyle={{
                  backgroundColor: '$blue2'
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
