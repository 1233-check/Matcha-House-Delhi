# E2E Test Infra: Matcha House Delhi Website Rebuild

## Test Philosophy
- Opaque-box, requirement-driven automated verification.
- Automated tests run against `http://localhost:8080` (or statically validated where headless HTTP tests execute).
- Strict verification of all Acceptance Criteria:
  1. Hero section byte-for-byte SHA256 integrity (`fdbd20f70c1fd43b3355bd704d15321568c43ee92782059a21141d265a84932b`, 364 bytes).
  2. All 32 menu items verified by exact name, category, and base price.
  3. Oat milk toggle price math (+₹80).
  4. WhatsApp link validity (`https://wa.me/919999999999` with prefilled drink name/price).
  5. Events section tiers (Basic ₹1,500 / Premium ₹2,500), seats counter, booking CTA.
  6. Social proof (reviews, ratings, Instagram handle).
  7. Loyalty program ("Matcha Insider", free cookie hook, name input).
  8. Location section (Google Maps embed iframe, Hauz Khas metro, live IST open/closed status calculation).
  9. SEO (Schema.org LocalBusiness JSON-LD, OpenGraph tags, GA4 placeholder).
  10. Responsiveness & CSS layout (no horizontal scrollbar at 320px, custom cursor hidden on touch devices).
  11. Zero console errors on load and interaction.

## Feature Inventory Test Mapping
| # | Feature | Requirement | Tier 1 (Unit/Content) | Tier 2 (Boundary/Edge) | Tier 3 (Integration) | Tier 4 (E2E Scenario) |
|---|---------|-------------|:---------------------:|:----------------------:|:--------------------:|:---------------------:|
| 1 | Hero Preservation | Byte-for-byte lines 45-52 | SHA256 matches baseline | Byte length exactly 364 | Link `#secret-ritual` resolves | Hero renders with cupCanvas |
| 2 | Menu 32 Items | R1 | 32 items present | All prices positive integers | Category tabs filter items | Oat milk toggle updates all 32 |
| 3 | WhatsApp Funnel | R2 | wa.me/919999999999 present | URL encoding valid | Drink names in WA query | Order CTA opens WA link |
| 4 | Events / Masterclass | R3 | Basic ₹1500 / Premium ₹2500 | Seats counter > 0 | Booking CTA points to WA | Masterclass registration flow |
| 5 | Social Proof | R4 | Reviews with star ratings | Instagram feed present | Carousel elements intact | Testimonial browsing |
| 6 | Loyalty Program | R5 | Name input & CTA present | Free cookie hook mentioned | WA prefilled text has name | Loyalty signup flow |
| 7 | Location & Hours | R6 | Maps iframe & metro info | IST 8AM-9PM logic checked | Live open/close indicator | Directions link functional |
| 8 | SEO & Metadata | R7 | Schema.org LocalBusiness | OpenGraph tags present | GA4 script tag present | Google rich snippet validity |
| 9 | Mobile & Polish | R8 | 320px viewport fits cleanly | Cursor desktop-only scoped | All anchor targets exist | Mobile navigation & tap |

## Test Runner Architecture
- Test Suite script: `tests/e2e_test_suite.py`
- Can be executed via: `python3 tests/e2e_test_suite.py`
- Produces `TEST_READY.md` upon completion.
