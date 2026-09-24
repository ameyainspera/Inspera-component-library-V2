import HomeScreen from '../../imports/pasted_text/home-screen'

/**
 * Home dashboard - the real Inspera institution home screen. Rather than a
 * bespoke assembly, this renders the product's own HomeScreen component (its
 * navy TopNav, the stats band and the Recent events feed), mirroring how the
 * Test setup page reuses the real AssessorNav. Swap the `stats`/`events` props
 * to reskin it with your own data.
 */
export default function HomeDashboard() {
  return (
    <HomeScreen
      onHome={() => {}}
      onNavigate={() => {}}
    />
  )
}
