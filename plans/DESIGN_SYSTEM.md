# Estes Park Guide App - Design System

**Version**: 1.0  
**Last Updated**: January 25, 2026

---

## Color Palette

### Primary Colors

- **Forest Green**: `#2D5016` - Primary brand color, CTA buttons, active states
- **Light Green**: `#4A7C2C` - Secondary actions, hover states
- **Dark Green**: `#1F3A0F` - Dark backgrounds, text accents

### Secondary Colors

- **Orange Accent**: `#F97316` - Highlights, alerts, important information
- **Sky Blue**: `#0EA5E9` - Information, secondary accents

### Neutral Colors

- **Off-white**: `#FAFAF9` - Main background
- **Light Gray**: `#F3F4F6` - Secondary background, cards
- **Medium Gray**: `#E5E7EB` - Borders, dividers
- **Dark Gray**: `#6B7280` - Secondary text
- **Charcoal**: `#1F2937` - Primary text
- **Black**: `#000000` - Text, icons (use with caution)

### Semantic Colors

- **Success**: `#10B981` - Confirmations, success states
- **Warning**: `#FBBF24` - Warnings, cautions
- **Error**: `#EF4444` - Errors, destructive actions
- **Info**: `#3B82F6` - Information, tips

### Difficulty Colors

- **Easy**: `#10B981` (Green)
- **Moderate**: `#FBBF24` (Yellow)
- **Hard**: `#F97316` (Orange)
- **Expert**: `#EF4444` (Red)

---

## Typography

### Font Family

- **Primary**: SF Pro Display (iOS), Roboto (Android)
- **Fallback**: System Font Stack
- **Display/Headings**: Bold, High contrast
- **Body**: Regular, High readability
- **Monospace**: For code/technical info

### Font Sizes & Weights

| Usage           | Size | Weight        | Line Height |
| --------------- | ---- | ------------- | ----------- |
| Display Heading | 32px | 700 Bold      | 40px        |
| Main Heading    | 28px | 700 Bold      | 36px        |
| Section Heading | 24px | 600 Semi-bold | 32px        |
| Subheading      | 18px | 600 Semi-bold | 26px        |
| Body Text       | 16px | 400 Regular   | 24px        |
| Secondary Text  | 14px | 400 Regular   | 20px        |
| Small Text      | 12px | 600 Semi-bold | 16px        |
| Tiny Text       | 11px | 400 Regular   | 14px        |

### Text Color Usage

- **Primary Text**: `#1F2937` (Charcoal)
- **Secondary Text**: `#6B7280` (Dark Gray)
- **Tertiary Text**: `#9CA3AF` (Medium Gray)
- **Inverse Text**: `#FFFFFF` (White, on dark backgrounds)
- **Interactive Text**: `#2D5016` (Forest Green)

---

## Spacing System

**8px Grid System** - All spacing should be multiples of 8px

### Spacing Scale

- **xs**: 4px (small gaps between elements)
- **sm**: 8px (standard padding)
- **md**: 12px (medium padding)
- **lg**: 16px (large padding)
- **xl**: 24px (extra large padding)
- **2xl**: 32px (section spacing)
- **3xl**: 48px (large section spacing)
- **4xl**: 64px (extra large section spacing)

### Component Padding

- **Button**: 12px (vertical) × 16px (horizontal)
- **Card**: 16px (all sides)
- **Input Field**: 12px (vertical) × 14px (horizontal)
- **Screen**: 16px (sides), 24px (top/bottom)
- **List Item**: 12px (vertical) × 16px (horizontal)

### Margins

- **Between sections**: 32px
- **Between items in list**: 12px
- **Below heading**: 16px

---

## Border & Corner Radius

### Border Radius

- **None**: `0px` - Strict edges
- **sm**: `4px` - Slight rounding
- **md**: `8px` - Standard rounding (most components)
- **lg**: `12px` - Large rounding
- **xl**: `16px` - Extra large rounding
- **full**: `9999px` - Pill shape / circles

### Border Thickness

- **thin**: `1px` - Subtle borders
- **default**: `2px` - Standard borders
- **thick**: `3px` - Emphasized borders

### Border Color

- **Default**: `#E5E7EB` (Medium Gray)
- **Active**: `#2D5016` (Forest Green)
- **Error**: `#EF4444` (Red)

---

## Shadow System

### Shadow Depths

| Level  | Shadow                         | Usage                     |
| ------ | ------------------------------ | ------------------------- |
| **sm** | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle elevation          |
| **md** | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons            |
| **lg** | `0 10px 15px rgba(0,0,0,0.15)` | Modals, elevated surfaces |
| **xl** | `0 20px 25px rgba(0,0,0,0.2)`  | Top-level overlays        |

### Glassmorphism Effect

```css
Background: rgba(255, 255, 255, 0.7)
Backdrop Filter: blur(10px)
Border: 1px solid rgba(255, 255, 255, 0.2)
Shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
```

---

## Component Styles

### Buttons

#### Button Variants

**Primary Button**

- Background: `#2D5016` (Forest Green)
- Text: White
- Padding: 12px × 16px
- Border Radius: 8px
- Font Weight: 600
- Hover State: `#1F3A0F` (Dark Green)
- Active State: Scale 0.95 (slight press effect)

**Secondary Button**

- Background: `#E5E7EB` (Light Gray)
- Text: `#1F2937` (Charcoal)
- Padding: 12px × 16px
- Border Radius: 8px
- Hover State: `#D1D5DB` (Darker Gray)

**Tertiary Button** (Ghost)

- Background: Transparent
- Text: `#2D5016` (Forest Green)
- Border: 1px solid `#E5E7EB`
- Padding: 12px × 16px
- Hover State: Background `#F3F4F6`

**Danger Button**

- Background: `#EF4444` (Red)
- Text: White
- Hover State: `#DC2626` (Darker Red)

### Card Components

**Standard Card**

- Background: White
- Border Radius: 8px
- Shadow: md
- Padding: 16px
- Border: 1px solid `#E5E7EB`

**Glass Card** (with glassmorphism)

- Background: rgba(255, 255, 255, 0.7)
- Backdrop Filter: blur(10px)
- Border: 1px solid rgba(255, 255, 255, 0.2)
- Shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
- Border Radius: 12px

### Input Fields

**Text Input**

- Border: 1px solid `#E5E7EB`
- Border Radius: 8px
- Padding: 12px × 14px
- Font Size: 16px
- Focus State: Border color `#2D5016`, Shadow lg
- Error State: Border color `#EF4444`

**Placeholder Text**: `#9CA3AF` (Medium Gray)

### Badge/Chip Components

**Standard Badge**

- Background: `#E5E7EB`
- Text: `#1F2937`
- Padding: 4px × 8px
- Border Radius: full
- Font Size: 12px

**Colored Badges**

- Success: Background `#10B981`, Text White
- Warning: Background `#FBBF24`, Text `#1F2937`
- Error: Background `#EF4444`, Text White
- Info: Background `#3B82F6`, Text White

### Difficulty Badges

**Easy Badge**

- Background: `#10B981` (Green)
- Text: White
- Icon: ✓ or simplified symbol

**Moderate Badge**

- Background: `#FBBF24` (Yellow)
- Text: `#1F2937`

**Hard Badge**

- Background: `#F97316` (Orange)
- Text: White

**Expert Badge**

- Background: `#EF4444` (Red)
- Text: White

---

## Animations

### Timing Functions

- **Fast**: `150ms` - Quick feedback
- **Standard**: `200-300ms` - Default interactions
- **Slow**: `500ms` - Deliberate animations
- **Easing**: `ease-in-out` for most animations

### Spring Animation Values

- **Default**: tension: 50, friction: 5
- **Bouncy**: tension: 100, friction: 10
- **Stiff**: tension: 200, friction: 20

### Common Animations

**Fade In**

- Duration: 200ms
- Easing: ease-out
- Opacity: 0 → 1

**Slide Up**

- Duration: 300ms
- Easing: ease-out
- Transform: translateY(20px) → translateY(0)

**Scale**

- Duration: 200ms
- Transform: scale(1) → scale(1.05) on hover

**Stagger Lists**

- Delay: 50ms between items
- Creates cascading effect

**Tab Swipe**

- Duration: 300ms
- Spring animation for bounce

---

## Responsive Design

### Breakpoints

| Device          | Width      | Usage                       |
| --------------- | ---------- | --------------------------- |
| **Phone Small** | < 375px    | iPhone SE, small Android    |
| **Phone**       | 375-414px  | Standard phones             |
| **Phone Large** | 414-600px  | Large phones, small tablets |
| **Tablet**      | 600-1200px | Tablets                     |
| **Web**         | 1200px+    | Web/desktop (if applicable) |

### Responsive Strategies

- **Mobile First**: Design for small screens first
- **Touch Targets**: Minimum 44×44px for buttons
- **Safe Areas**: Account for notches and home indicators
- **Orientation**: Support both portrait and landscape
- **Font Scaling**: Use relative sizing where appropriate

---

## Accessibility Guidelines

### Color Contrast

- **Normal Text**: Minimum WCAG AA (4.5:1)
- **Large Text**: Minimum WCAG AA (3:1)
- **UI Components**: Minimum WCAG AA (3:1)

### Text

- **Minimum Font Size**: 12px (preferably 14px)
- **Line Height**: Minimum 1.5x font size
- **Letter Spacing**: 0.5px for improved readability

### Interactive Elements

- **Touch Target Size**: Minimum 44×44px
- **Focus States**: Visible focus indicator (usually border)
- **Disabled State**: Clear visual distinction

### Icons

- **Size**: Minimum 24×24px (ideally 32×32px)
- **Stroke Width**: 2px for visibility
- **Padding**: Add internal padding for smaller icons

---

## Component States

### Button States

- **Default**: Base styling
- **Hover**: Slight color shift or shadow increase
- **Active/Pressed**: Scale down (0.95), darker color
- **Disabled**: Opacity 0.5, cursor not-allowed
- **Loading**: Spinner or skeleton animation

### Form States

- **Default**: Clean, focused
- **Focused**: Border highlight, shadow
- **Filled**: Text visible, clear affordance
- **Error**: Red border, error icon, error message below
- **Success**: Green check mark

### Loading States

- **Skeleton**: Placeholder content shape
- **Spinner**: Centered rotation animation
- **Shimmer**: Gradient shimmer effect
- **Progress**: Bar or percentage indication

---

## Dark Mode (Optional Future Enhancement)

### Dark Palette Alternative

- Background: `#1F2937`
- Secondary BG: `#111827`
- Text: `#F9FAFB`
- Secondary Text: `#D1D5DB`
- Borders: `#374151`
- Cards: `#1F2937` with border

---

## Usage Guidelines

### When to Use Each Component

**Glassmorphism Cards**

- Floating sections on top of images
- Tab bar (already implemented)
- Floating action buttons
- Modal backgrounds

**Standard Cards**

- Trail listings
- Weather widgets
- Review cards
- General content containers

**Primary Button**

- Main calls-to-action
- Form submissions
- Navigation actions

**Secondary Button**

- Alternative actions
- Less important CTAs
- Cancel operations

**Input Fields**

- Search bars
- Form fields
- Profile editing

---

## Design Assets Location

- **Icons**: Use Expo Vector Icons (FontAwesome, MaterialIcons, Ionicons)
- **Images**: Store in `src/assets/images/`
- **Fonts**: Already configured in `src/assets/fonts/`
- **Colors Constant**: `src/constants/colors.ts`
- **Spacing Constant**: `src/constants/spacing.ts`

---

## Implementation Tips

1. **Use Constants**: Always reference color/spacing constants, never hardcode
2. **Consistent Rounding**: Use `md` (8px) as default, vary only when necessary
3. **Maintain Hierarchy**: Use color, size, and weight to establish visual hierarchy
4. **Glassmorphism**: Use on interactive overlays and floating elements
5. **Animations**: Keep smooth but purposeful, avoid motion sickness triggers
6. **Testing**: Verify colors on both light and dark device themes
7. **Performance**: Optimize blur effects for smooth 60 FPS
8. **Accessibility**: Always check contrast and touch targets

---

## Common Component Patterns

### Trail Card Pattern

- Image + gradient overlay
- Title
- Difficulty badge
- Distance & elevation quick stats
- Heart favorite button (top right)
- Tap action: navigate to detail

### Section Heading Pattern

- Text: 24px, semi-bold
- Color: Forest Green (`#2D5016`)
- Bottom border: 2px, Light Green
- Padding: 16px bottom

### Feature Tag Pattern

- Pill shape (border-radius: full)
- Size: 12px font
- Padding: 4px × 8px
- Background: Light gray
- Icon (optional): left side

---

**Version History**

- v1.0 - Initial design system (Jan 25, 2026)

**Next Review**: After first UI implementation passes
