import DeckScrollView from '@/components/deck/DeckScrollView'
import { getLevelsInfo } from '@/features/converters'
import {useDeck, useUserId} from '@/features/hooks'
import useLanguage from '@/features/hooks/useLanguage'
import { useAppDispatch } from '@/features/hooks/useRedux'
import CustomBottomSheetModal from '@/modules/CustomBottomSheetModal'
import Loader from '@/modules/Loader'
import {useGetAllLikesQuery, useSendPromoMutation} from '@/services/api'
import { IDeck } from '@/services/types/types'
import { setDecksLikesSet } from '@/store/reducer/deck-likes-slice'

import SearchBar from '@/UI/SearchBar'
import Switcher from '@/UI/Switcher'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import Animated, {
	Extrapolate,
	interpolate, SharedValue,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import {setQuestionsLikesSet} from "@/store/reducer/question-like-slice";
const { width } = Dimensions.get('window')

const WithUserId = ({ children }: {children: (userId: string) => React.ReactNode}) => {
	const userId = useUserId()
	if (!userId) {
		return <Loader />
	} else {
		return children(userId)
	}
}

const Page = () => {
	return <WithUserId>
		{(userId)=><PageWithUserId userId={userId}/>}
	</WithUserId>
}

const filterDecks = (decks: IDeck[], search: string)=>{
	return decks.filter(d=>{
		return d.name.toLowerCase().includes(search.toLowerCase())
			|| d.promo.toLowerCase().includes(search.toLowerCase())
	})
}

const searchBarStyle = (scrollY: SharedValue<number>)=>useAnimatedStyle(() => {
	const searchBarWidth = interpolate(
		scrollY.value,
		[0, 20],
		[width - 148, 48],
		Extrapolate.CLAMP
	)

	const shadowOpacity = interpolate(
		scrollY.value,
		[0, 100],
		[0, 0.25],
		Extrapolate.CLAMP
	)

	const shadowOffset = interpolate(
		scrollY.value,
		[0, 100],
		[0, 4],
		Extrapolate.CLAMP
	)

	return {
		width: withTiming(searchBarWidth, { duration: 800 }),
		shadowColor: '#000000',
		// shadowOffset: withTiming({ width: 0, height: 4 }, { duration: 500 }),
		shadowRadius: 4,
		shadowOpacity: withTiming(shadowOpacity, { duration: 1000 }),
		elevation: 5
	}
})
const switcherStyle = (scrollY: SharedValue<number>)=>useAnimatedStyle(() => {
	const scrollOffset = interpolate(
		scrollY.value,
		[0, 10],
		[0, 150],
		Extrapolate.CLAMP
	)

	const opacity = interpolate(
		scrollY.value,
		[0, 10],
		[1, 0],
		Extrapolate.CLAMP
	)
	return {
		transform: [{ translateX: withTiming(scrollOffset, { duration: 600 }) }],
		opacity: withTiming(opacity, { duration: 600 })
	}
})

const PageWithUserId = ({userId}: {userId: string}) => {
	const {
		decks,
		isLoadingDecks,
		isFetchingDecks,
		refetch: refetchDecks
	} = useDeck(userId)
	//TODO кнопка информации о колоде нажимается не с первого раза
	const dispatch = useAppDispatch()
	const { changeLanguage } = useLanguage()
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const scrollY = useSharedValue(0)
	const scrollRef = useAnimatedRef<Animated.ScrollView>()

	const [searchText, setSearchText] = useState('')
	const [selectedDeck, setSelectedDeck] = useState<IDeck>()
	const [filteredDecks, setFilteredDecks] = useState<IDeck[]>([])
	const [sendPromo] = useSendPromoMutation()
	useEffect(() => {
		if(decks){
			setFilteredDecks(filterDecks(decks, searchText))
		}
	}, [decks, searchText]);

	const { data: likes, isFetching: isFetchingLikes } =
		useGetAllLikesQuery(userId)
	useEffect(() => {
		if (likes) {
			if (likes.decks) dispatch(setDecksLikesSet(likes.decks))
			if (likes.questions) dispatch(setQuestionsLikesSet(likes.questions))
		}
	}, [likes])

	/*ANIMATION*/
	const scrollToTop = (scrollRef: any) => {
		scrollRef.current?.scrollTo({ y: 0, animated: true })
	}

	const handleScrollToTop = () => {
		scrollToTop(scrollRef)
	}

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: event => {
			scrollY.value = event.contentOffset.y
		}
	})
	/*END ANIMATION*/

	const onSelectDeck = (deck: IDeck) => {
		bottomSheetRef.current?.present()
		setSelectedDeck(deck)
	}

	const onSearchSubmit = ()=>{
		sendPromo({promo: searchText, userId})
		handleScrollToTop()
		refetchDecks()
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.switcherContainer}>
				<Switcher
					switcherStyle={switcherStyle(scrollY)}
					onLanguageChange={changeLanguage}
				/>
			</View>

			<SearchBar
				searchBarStyle={searchBarStyle(scrollY)}
				onChangeInput={setSearchText}
				onSearchSubmit={onSearchSubmit}
			/>

			{isLoadingDecks || isFetchingDecks || isFetchingLikes ? (
				<Loader />
			) : (
				<DeckScrollView
					scrollRef={scrollRef}
					scrollHandler={scrollHandler}
					filteredDecks={filteredDecks}
					onSelectDeck={onSelectDeck}
					handleDismissSheet={() => bottomSheetRef.current?.dismiss()}
					decks={decks}
				/>
			)}
			{selectedDeck && <CustomBottomSheetModal
				deck={selectedDeck}
				ref={bottomSheetRef}
				userId={userId}
			/>}
		</SafeAreaView>
	)
}
export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: Platform.OS === 'ios' ? -35 : 0,
		height: '100%',
		width: '100%'
	},
	switcherContainer: {
		flex: 1,
		position: 'absolute',
		top: 50,
		left: 20,
		zIndex: 100,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 25
	}
})
