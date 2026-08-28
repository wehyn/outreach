---
version: alpha
name: Outreach Charcoal
description: A focused, charcoal-first workspace for thoughtful marketing outreach.
colors:
  primary: "#D7A85F"
  primaryHover: "#E4B873"
  canvas: "#171715"
  surface: "#20201D"
  surfaceElevated: "#292925"
  textPrimary: "#F4F0E8"
  textMuted: "#B2ADA3"
  textFaint: "#7C7971"
  border: "#393833"
  borderSoft: "#2B2B27"
  success: "#82C795"
  warning: "#D7A85F"
  danger: "#E58B8B"
typography:
  display:
    fontFamily: Geist
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  heading:
    fontFamily: Geist
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: Geist
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Geist
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  mono:
    fontFamily: "Geist Mono"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  buttonPrimary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "12px"
  buttonPrimaryHover:
    backgroundColor: "{colors.primaryHover}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.sm}"
    padding: "12px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.md}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surfaceElevated}"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.sm}"
    padding: "12px"
---

## Overview

Outreach is an **Operate** surface: the user is here to decide who to contact next, understand why, and record what happened. The visual language is quiet and exact so the prospect data remains the focus.

## Colors

Charcoal is the primary canvas, not pure black. Warm off-white text keeps the interface readable without feeling stark. Muted amber is the single brand accent and should signal an intentional action or priority, not decorate every surface. Green, amber, and red are reserved for explicit status meaning.

## Typography

Geist creates a precise but approachable interface. Geist Mono is reserved for compact metadata such as scores, dates, IDs, and keyboard shortcuts. Type scale, alignment, and whitespace provide hierarchy before borders or containers do.

## Layout

Use a 4px base unit and a practical 8/12/16/24/32px rhythm. The desktop workspace uses a narrow persistent navigation rail and a wide content canvas. Tables and pipeline views favor information density; forms and dialogs use more generous spacing.

## Elevation & Depth

Prefer one surface with thin borders. Use a slightly lighter elevated surface for menus, dialogs, and focused controls. Shadows should be soft and limited to floating elements; there are no decorative glows or background effects.

## Shapes

Use restrained 6px–12px radii. Avoid oversized pills and rounded containers that make every element look like a separate card. Status labels may use a compact pill when the status benefits from quick scanning.

## Components

Primary actions use the amber accent with dark text. Secondary actions use a transparent or neutral surface treatment. Panels are quiet containers for related work, not feature tiles. Every interactive component needs visible hover and keyboard-focus states, with at least 44px hit areas on mobile.

## Do's and Don'ts

- Do keep the lead, next action, and reason for outreach visible together.
- Do use one visual emphasis per section.
- Do provide loading, empty, error, and confirmation states.
- Do preserve readable contrast and never rely on color alone.
- Don't use gradients, glassmorphism, decorative illustrations, or icon grids.
- Don't fill empty space with invented metrics or generic marketing copy.
- Don't add a second accent color without a clear semantic reason.
