import { useState } from 'react'
import { Alert } from 'react-native'
import {
  YStack,
  XStack,
  Input,
  Button,
  H2,
  H3,
  Label,
  Card,
  Separator,
  Paragraph
} from 'tamagui'
import { LogIn, UserPlus, Eye, EyeOff } from '@tamagui/lucide-icons'
import { useAuth } from '../contexts/AuthContext'

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, signUp, loading } = useAuth()

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      Alert.alert('Error', error.message || 'Authentication failed')
    } else if (!isLogin) {
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => setIsLogin(true) }]
      )
    }
    // If login succeeds, the AuthContext will handle navigation automatically
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setEmail('')
    setPassword('')
  }

  return (
    <YStack f={1} bg="$background" justifyContent="center" p="$4">
      <YStack alignItems="center" mb="$8">
        <H2 color="$color" mb="$2">What's For Dinner</H2>
        <H3 theme="alt2" mb="$4">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </H3>
      </YStack>

      <Card elevate size="$4" bordered p="$4" mb="$4">
        <YStack gap="$4">
          {/* Email Input */}
          <YStack gap="$2">
            <Label htmlFor="email" size="$4" fontWeight="600">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              size="$4"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </YStack>

          {/* Password Input */}
          <YStack gap="$2">
            <Label htmlFor="password" size="$4" fontWeight="600">
              Password
            </Label>
            <XStack alignItems="center" gap="$2">
              <Input
                id="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                size="$4"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete={isLogin ? "current-password" : "new-password"}
                f={1}
              />
              <Button
                size="$3"
                variant="ghost"
                icon={showPassword ? EyeOff : Eye}
                onPress={() => setShowPassword(!showPassword)}
              />
            </XStack>
          </YStack>

          {/* Submit Button */}
          <Button
            size="$5"
            theme="blue"
            onPress={handleSubmit}
            disabled={loading}
            icon={isLogin ? LogIn : UserPlus}
            mt="$2"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </YStack>
      </Card>

      {/* Toggle between login/signup */}
      <YStack alignItems="center" gap="$3">
        <Separator />
        <XStack alignItems="center" gap="$2">
          <Paragraph size="$3" theme="alt2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Paragraph>
          <Button
            size="$3"
            variant="outlined"
            onPress={toggleMode}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  )
}
