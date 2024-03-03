import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

export const useUserId = () => {
	const [userId, setUserId] = useState<any>(null)

	useEffect(() => {
		const getUserId = async () => {
			const user_id = await AsyncStorage.getItem('user_id')
			setUserId(user_id)
		}
		getUserId()
	}, [])

	return userId
}
