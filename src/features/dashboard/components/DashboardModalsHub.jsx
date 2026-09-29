import React, { lazy, memo, Suspense } from 'react';
import { getStoredAchievements } from '../../../utils/badgeManager';

const PocketPlanetariumModal = lazy(
	() => import('../PocketPlanetariumModal'),
);
const ConstellationObservatory = lazy(
	() => import('../ConstellationObservatory'),
);
const GalaxyOdysseyModal = lazy(
	() => import('../GalaxyOdysseyModal'),
);
const CosmicHabitatModal = lazy(
	() => import('../CosmicHabitatModal'),
);
const EducatorPortalModal = lazy(
	() => import('../EducatorPortalModal'),
);
const CrewSwitcherModal = lazy(
	() => import('../CrewSwitcherModal'),
);
const PerformanceObservatoryModal = lazy(
	() => import('../PerformanceObservatoryModal'),
);

/**
 * DashboardModalsHub Component
 *
 * Implements SOLID Single Responsibility:
 * Hub orchestrating on-demand mounting and lifecycle of dashboard exploration modals.
 */
export const DashboardModalsHub = memo(function DashboardModalsHub({
	isPlanetariumOpen,
	setIsPlanetariumOpen,
	isObservatoryOpen,
	setIsObservatoryOpen,
	isOdysseyOpen,
	setIsOdysseyOpen,
	isHabitatOpen,
	setIsHabitatOpen,
	isEducatorPortalOpen,
	setIsEducatorPortalOpen,
	isCrewModalOpen,
	setIsCrewModalOpen,
	isPerformanceModalOpen,
	setIsPerformanceModalOpen,
	soundEnabled,
	kidName,
	kidAge,
	kidGender,
	kidAvatar,
	setKidName,
	setKidAge,
	setKidGender,
	setKidAvatar,
	setAchievements,
}) {
	return (
		<Suspense fallback={null}>
			{isPlanetariumOpen && (
				<PocketPlanetariumModal
					isOpen={isPlanetariumOpen}
					onClose={() => setIsPlanetariumOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}
			{isObservatoryOpen && (
				<ConstellationObservatory
					isOpen={isObservatoryOpen}
					onClose={() => setIsObservatoryOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}
			{isOdysseyOpen && (
				<GalaxyOdysseyModal
					isOpen={isOdysseyOpen}
					onClose={() => setIsOdysseyOpen(false)}
					soundEnabled={soundEnabled}
					kidName={kidName}
				/>
			)}
			{isHabitatOpen && (
				<CosmicHabitatModal
					isOpen={isHabitatOpen}
					onClose={() => setIsHabitatOpen(false)}
					soundEnabled={soundEnabled}
					kidName={kidName}
				/>
			)}
			{isEducatorPortalOpen && (
				<EducatorPortalModal
					isOpen={isEducatorPortalOpen}
					onClose={() => setIsEducatorPortalOpen(false)}
					soundEnabled={soundEnabled}
					kidName={kidName}
					kidAge={kidAge}
				/>
			)}
			{isCrewModalOpen && (
				<CrewSwitcherModal
					isOpen={isCrewModalOpen}
					onClose={() => setIsCrewModalOpen(false)}
					soundEnabled={soundEnabled}
					currentKidName={kidName}
					currentKidAge={kidAge}
					currentKidGender={kidGender}
					currentKidAvatar={kidAvatar}
					onCrewSwitched={(profile) => {
						if (profile.name && setKidName) setKidName(profile.name);
						if (profile.age && setKidAge) setKidAge(profile.age);
						if (profile.gender && setKidGender) setKidGender(profile.gender);
						if (profile.avatar && setKidAvatar) setKidAvatar(profile.avatar);
						if (setAchievements) setAchievements(getStoredAchievements());
					}}
				/>
			)}
			{isPerformanceModalOpen && (
				<PerformanceObservatoryModal
					isOpen={isPerformanceModalOpen}
					onClose={() => setIsPerformanceModalOpen(false)}
					soundEnabled={soundEnabled}
				/>
			)}
		</Suspense>
	);
});

export default DashboardModalsHub;
