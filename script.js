"use strict";


/* Mobile navigation ---------------------------------------- */

const menuButton = document.querySelector(
  ".mobile-menu-button"
);

const navigation = document.querySelector(
  "#main-navigation"
);

const navigationLinks = document.querySelectorAll(
  "#main-navigation .nav-link"
);

const mobileBreakpoint = window.matchMedia(
  "(max-width: 600px)"
);

let animationCleanupTimer;


/**
 * Enables menu animation temporarily.
 */
function enableMenuAnimation() {
  if (!navigation) {
    return;
  }

  window.clearTimeout(animationCleanupTimer);

  navigation.classList.add("is-animating");
}


/**
 * Removes the animation class after the transition finishes.
 *
 * This means resizing across the mobile breakpoint does not
 * animate the menu from its desktop state into its hidden state.
 */
function scheduleAnimationCleanup() {
  if (!navigation) {
    return;
  }

  window.clearTimeout(animationCleanupTimer);

  animationCleanupTimer = window.setTimeout(() => {
    navigation.classList.remove("is-animating");
  }, 350);
}


/**
 * Opens the mobile navigation menu.
 */
function openMenu() {
  if (
    !menuButton ||
    !navigation ||
    !mobileBreakpoint.matches
  ) {
    return;
  }

  enableMenuAnimation();

  /*
    Allow the browser to apply the animation class before
    changing the menu to its open state.
  */
  window.requestAnimationFrame(() => {
    navigation.classList.add("is-open");
    menuButton.classList.add("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    menuButton.setAttribute(
      "aria-label",
      "Close navigation menu"
    );

    scheduleAnimationCleanup();
  });
}


/**
 * Closes the mobile navigation menu.
 *
 * Setting animate to false closes it immediately. This is used
 * during breakpoint changes to avoid the resize flicker.
 */
function closeMenu(animate = true) {
  if (!menuButton || !navigation) {
    return;
  }

  window.clearTimeout(animationCleanupTimer);

  if (animate && mobileBreakpoint.matches) {
    enableMenuAnimation();
  } else {
    navigation.classList.remove("is-animating");
  }

  navigation.classList.remove("is-open");
  menuButton.classList.remove("is-open");

  menuButton.setAttribute(
    "aria-expanded",
    "false"
  );

  menuButton.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  if (animate && mobileBreakpoint.matches) {
    scheduleAnimationCleanup();
  }
}


/**
 * Switches between the open and closed states.
 */
function toggleMenu() {
  if (!navigation) {
    return;
  }

  const menuIsOpen =
    navigation.classList.contains("is-open");

  if (menuIsOpen) {
    closeMenu(true);
  } else {
    openMenu();
  }
}


/**
 * Immediately resets the menu when crossing between desktop
 * and mobile layouts.
 */
function handleBreakpointChange() {
  closeMenu(false);
}


if (menuButton && navigation) {
  menuButton.addEventListener(
    "click",
    toggleMenu
  );


  /*
    Close after selecting a page link.
  */
  navigationLinks.forEach((link) => {
    link.addEventListener(
      "click",
      () => closeMenu(true)
    );
  });


  /*
    Close when clicking outside the navbar.
  */
  document.addEventListener(
    "click",
    (event) => {
      const clickedElement =
        event.target instanceof Element
          ? event.target
          : null;

      const clickedInsideNavbar =
        clickedElement?.closest(".navbar-wrapper");

      if (!clickedInsideNavbar) {
        closeMenu(true);
      }
    }
  );


  /*
    Close with the Escape key.
  */
  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        navigation.classList.contains("is-open")
      ) {
        closeMenu(true);
        menuButton.focus();
      }
    }
  );


  /*
    Reset immediately whenever the responsive breakpoint changes.
  */
  if (
    typeof mobileBreakpoint.addEventListener === "function"
  ) {
    mobileBreakpoint.addEventListener(
      "change",
      handleBreakpointChange
    );
  } else {
    /*
      Fallback for older Safari versions.
    */
    mobileBreakpoint.addListener(
      handleBreakpointChange
    );
  }


  /*
    Ensure the menu begins in a clean closed state.
  */
  closeMenu(false);
}


/* Fixed hero visibility ------------------------------------ */

const heroSection = document.querySelector(
  ".parallax"
);

const fixedHeroBackground = document.querySelector(
  ".fixed-hero-background"
);


/**
 * Stops the fixed hero background from being rendered once the
 * transparent hero section has completely left the viewport.
 *
 * The fixed background becomes visible again automatically when
 * the user scrolls back towards the hero.
 */
if (
  heroSection &&
  fixedHeroBackground &&
  "IntersectionObserver" in window
) {
  const heroVisibilityObserver =
    new IntersectionObserver(
      ([entry]) => {
        fixedHeroBackground.classList.toggle(
          "is-hidden",
          !entry.isIntersecting
        );
      },
      {
        root: null,
        threshold: 0
      }
    );

  heroVisibilityObserver.observe(heroSection);
}