# Interview Answers — Design Systems and AI-Assisted Engineering

## 1. How would you structure design tokens?

I would start by researching the product and understanding its brand identity, including its primary colour. I would use Figma and Material Design 3 as a guide to prepare the colour system, typography and shadows.

For the colour system, I would identify the key colours and generate tonal palettes. For example, I could use a monochromatic colour combination to create a harmonious palette, depending on the product's needs.

I would organise the tokens into primitive tokens, which hold the underlying values, and semantic tokens, which assign meaning to those values. For example, a primitive token could store a primary palette colour, while a semantic token would define its use as the primary colour in the interface.

After preparing and validating the design system, I would export the necessary variables as JSON and use Antigravity to convert the tokens into CSS for the product.

## 2. When is a token change breaking?

A token change can be breaking when its name or structure changes in a way that causes existing references to stop working. For example, renaming or removing a token without updating the components that depend on it can break those references.

Changing only a token's value does not automatically make the change breaking, although it can affect the appearance and accessibility of components using that token.

Replacing a token reference with a raw hex value can also create maintenance problems. The component might continue working, but it will no longer automatically follow changes to the referenced token. This can lead to inconsistencies as the design system evolves.

Therefore, I would check not only the value being changed but also the relationships between primitive tokens, semantic tokens and the components that use them.

## 3. How would you support multiple brands and themes?

I would first identify each brand's key colour and preserve its identity when generating its tonal palette. In my Figma workflow, I pinned the primary colour to help retain the intended colour during palette generation.

However, supporting multiple brands requires more than pinning colours. I would organise the system so that each brand has its own brand-specific token values while sharing reusable semantic roles and component structures.

For example, Brand A and Brand B could both use a `color-primary` role, but that role would resolve to a different colour for each brand.

I would also provide light and dark theme configurations for each brand, using Material Design 3 as a guide. This would allow the system to change its appearance without requiring every component to be redesigned.

## 4. Can tokens guarantee accessible contrast?

I would say yes and no. A well-organised token system can help maintain accessible colour combinations when the colour roles are properly defined and the combinations are validated.

However, tokens alone cannot guarantee accessibility. A colour combination might pass its contrast check in one context but fail when used with a different background.

Therefore, I would define appropriate semantic colour roles and validate the actual foreground and background combinations in which they are used. I would also consider accessibility requirements beyond colour contrast.

In my D Williams Fashion Hub design system, I checked 16 foreground and background combinations in the light theme. Those checks provide evidence for the combinations I tested, rather than proving that every possible combination or the dark theme is accessible.

## 5. How do you ensure that colour contrast guidelines are met within a website or application's design?

After preparing the design system in Figma, I would validate the colour combinations used in the interface. I would check foreground and background combinations, including text, buttons and meaningful icons or controls.

I would compare their contrast ratios against the relevant Web Content Accessibility Guidelines (WCAG) requirements to determine whether they pass.

For example, WCAG Level AA generally requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Relevant non-text elements also have contrast requirements.

I would record the results, correct combinations that fail, and repeat the checks when colours or roles change. I would also verify the implemented interface rather than relying only on the Figma design.

## 6. Can you discuss the differences between WCAG levels A, AA and AAA?

WCAG Levels A, AA and AAA are three levels of accessibility conformance.

Level A is the minimum level and addresses basic accessibility barriers. Level AA addresses additional requirements and is a common target for professional websites and applications. Level AAA has stricter requirements and is not generally feasible to achieve for every criterion across an entire website.

Colour contrast provides one example of the differences. Under the relevant text-contrast criteria, Level AA requires at least 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 for normal text and 4.5:1 for large text.

These levels cover more than colour contrast; they include other accessibility criteria as well. Therefore, achieving a particular contrast ratio alone does not establish that an entire website conforms to that WCAG level.

## 7. Discuss the importance of semantic HTML in the context of accessibility.

Semantic HTML helps screen readers and other assistive technologies understand the structure and purpose of website elements. It makes it clearer what a component is and how it is expected to function.

For example, using a proper HTML button tells the browser and assistive technologies that the element is an interactive control. It also provides standard keyboard behaviour. Using a generic element styled to look like a button does not automatically provide the same semantics or behaviour.

Semantic HTML therefore helps users understand and navigate a website more effectively.

It is related to ARIA and WCAG, but they are different. HTML provides meaningful elements and built-in behaviour, ARIA adds accessibility information when needed, and WCAG provides guidelines and criteria for evaluating accessibility.

## 8. How do you handle design handoff to developers using Figma?

After preparing my design system in Figma, I validate it by checking colour contrast and reviewing the colour roles and variables.

I then use the Design Token plugin in Figma to select the necessary design tokens and export them as a JSON file. This file can be handed to developers or used in my AI-assisted workflow.

However, the JSON export is only one part of the handoff. The developers also need to understand how the tokens should be used, including the difference between primitive values and semantic roles.

In my workflow, I use Antigravity to convert the exported tokens into CSS. After that, I would check that the generated CSS references the tokens correctly and that the implemented interface follows the intended design.

## 9. Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?

AI-generated interfaces can look generic when the agent lacks specific information about the product, business, users, brand identity and design requirements. Without sufficient context, it may fall back on familiar design patterns and make assumptions.

To reduce those assumptions, I engineer the context files and provide clear instructions and guardrails.

For example, I would provide a business brief describing the product and its users, branding information and design tokens defining the visual system, and project instruction files such as `AGENTS.md` and `Rules.md` to communicate constraints and expectations.

I would also provide relevant reference designs or screenshots when available.

These materials give the agent a more controlled environment to work within. They do not guarantee a perfect result, so I would still inspect and validate the generated interface against the requirements.

## 10. Your line height for Display Large is a specific number. Why that number and not one step either side of it? What would you lose with each?

In my typography system, Display Large has a font size of 64 px. I compared a line-height multiplier of 1.5 with 1.4.

At 1.5, the line height was 96 px. At 1.4, it was 89.6 px. I found that the 1.5 option looked too spaced out, while 1.4 gave me a more compact result that looked better in my design.

My decision was based on the visual rhythm and spacing of the heading rather than assuming that one multiplier is universally correct.

If the line height were too large, the heading could consume unnecessary vertical space and feel disconnected. If it were too small, the lines could feel cramped and become harder to distinguish.

I chose 1.4 because it gave me a better visual result in my design. I would still check the result with the actual font and content to ensure that the text remains readable.

## 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.

I would revisit the primary colour palette. I chose dark navy blue as my Primary 40 reference, but when generating the tonal palette, I observed an irregular progression around the middle tones: the palette became unexpectedly darker before becoming brighter again.

If I started again, I would re-evaluate the primary colour and how the palette is generated. I would check the tonal progression, review the colour roles that depend on those tones, and revalidate their contrast ratios.

The cost would mainly be additional design and validation time. If existing components already depended on the affected tokens, I might also need to update those references and check the implementation again.

I would treat this as a palette issue I observed in my own workflow, rather than assuming that every dark navy primary colour necessarily produces the same result.

## 12. A candidate exports hex values from Figma into one CSS file and calls it a single source of truth. What is missing, and what will go wrong in month four?

Centralising hex values in one CSS file is useful, but it does not by itself create a complete design-token system.

What is missing is the structure connecting primitive tokens, semantic colour roles and the components that consume them. A system needs more than a list of colours; it needs clear roles and references that communicate how those colours should be used.

For example, a component should reference an appropriate semantic token rather than hardcoding a hex value. That semantic token can then reference the underlying primitive token.

By month four, as more components are added and colour decisions change, hardcoded values and disconnected references can cause inconsistencies. Some components may update when a token changes, while others retain old colours. This makes maintenance harder and can lead to inconsistent visual results.

A structured token system with clear references and usage rules makes changes easier to manage. It does not eliminate every problem, but it reduces avoidable inconsistencies as the product grows.
