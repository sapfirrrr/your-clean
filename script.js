document.addEventListener("DOMContentLoaded", () => {

  const qs = (selector, root = document) => {
    return root.querySelector(selector);
  };

  const qsa = (selector, root = document) => {
    return [...root.querySelectorAll(selector)];
  };


  /* =========================
     MOBILE MENU
  ========================= */

  const burger = qs(".burger");
  const mobileMenu = qs(".mobile-menu");

  if (burger) {

    burger.addEventListener("click", () => {

      const open = mobileMenu.classList.toggle("open");

      burger.setAttribute(
        "aria-expanded",
        String(open)
      );

    });

  }


  qsa(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

      mobileMenu.classList.remove("open");

      burger?.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });


  /* =========================
     SMOOTH SCROLL
  ========================= */

  qsa('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const id = link.getAttribute("href");

      if (id === "#") {
        return;
      }

      const target = qs(id);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* =========================
     REVEAL ANIMATIONS
  ========================= */

  const revealObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: 0.08
    }
  );


  qsa(".reveal").forEach(element => {
    revealObserver.observe(element);
  });


  /* =========================
     CALCULATOR
  ========================= */

  const calc = {

    step: 1,

    type: "apartment",

    clean: "general",

    area: 55,

    extras: new Set()

  };


  const typeNames = {

    apartment: "Квартира",

    house: "Дом / коттедж",

    office: "Офис",

    other: "Другое"

  };


  const cleanNames = {

    regular: "Поддерживающая",

    general: "Генеральная",

    repair: "После ремонта"

  };


  const prices = {

    regular: 2200,

    general: 3500,

    repair: 5900

  };


  const extraPrices = {

    windows: 1200,

    fridge: 600,

    oven: 700

  };


  const extraNames = {

    windows: "Мойка окон",

    fridge: "Холодильник",

    oven: "Духовка"

  };


  const steps = qsa(".calc-step");

  const progress = qs(".progress-fill");

  const areaRange = qs("#areaRange");

  const areaValue = qs("#areaValue");


  /* =========================
     CALCULATOR PROGRESS
  ========================= */

  function updateProgress() {

    progress.style.width =
      `${calc.step * 25}%`;

  }


  function showStep(number) {

    calc.step = number;

    steps.forEach(step => {

      step.classList.toggle(
        "active",
        Number(step.dataset.step) === number
      );

    });

    updateProgress();

  }


  /* =========================
     PRICE CALCULATION
  ========================= */

  function calculate() {

    let price = prices[calc.clean];


    /*
      Базовая стоимость включает
      первые 50 м².
    */

    if (calc.area > 50) {

      price +=
        Math.ceil(
          (calc.area - 50) / 10
        ) * 450;

    }


    /*
      Коэффициенты для типов помещения.
    */

    if (calc.type === "house") {

      price =
        Math.round(price * 1.25);

    }


    if (calc.type === "office") {

      price =
        Math.round(price * 0.9);

    }


    /*
      Дополнительные услуги.
    */

    calc.extras.forEach(key => {

      price += extraPrices[key];

    });


    /*
      Округление.
    */

    return Math.round(price / 50) * 50;

  }


  /* =========================
     UPDATE RESULT
  ========================= */

  function updateResult() {

    qs("#resultType").textContent =
      typeNames[calc.type];


    qs("#resultClean").textContent =
      cleanNames[calc.clean];


    qs("#resultArea").textContent =
      `${calc.area} м²`;


    const extras =
      [...calc.extras]
        .map(key => extraNames[key]);


    qs("#resultExtras").textContent =
      extras.length
        ? extras.join(", ")
        : "—";


    qs("#totalPrice").textContent =
      `${calculate().toLocaleString("ru-RU")} ₽`;

  }


  /* =========================
     STEP 1 — TYPE
  ========================= */

  qsa(".choice[data-type]").forEach(button => {

    button.addEventListener("click", () => {

      qsa(".choice[data-type]")
        .forEach(element => {
          element.classList.remove("selected");
        });


      button.classList.add("selected");


      calc.type =
        button.dataset.type;


      showStep(2);

    });

  });


  /* =========================
     STEP 2 — CLEANING TYPE
  ========================= */

  qsa(".choice-inline[data-clean]")
    .forEach(button => {

      button.addEventListener("click", () => {

        qsa(".choice-inline[data-clean]")
          .forEach(element => {
            element.classList.remove("selected");
          });


        button.classList.add("selected");


        calc.clean =
          button.dataset.clean;


        showStep(3);

      });

    });


  /* =========================
     STEP 3 — AREA
  ========================= */

  areaRange?.addEventListener(
    "input",
    event => {

      calc.area =
        Number(event.target.value);


      areaValue.textContent =
        calc.area;

    }
  );


  /* =========================
     EXTRA SERVICES
  ========================= */

  qsa(".extra input").forEach(input => {

    input.addEventListener("change", () => {

      if (input.checked) {

        calc.extras.add(
          input.dataset.extra
        );

      } else {

        calc.extras.delete(
          input.dataset.extra
        );

      }

    });

  });


  /* =========================
     BACK BUTTONS
  ========================= */

  qsa(".calc-back").forEach(button => {

    button.addEventListener("click", () => {

      if (calc.step === 2) {

        showStep(1);

      } else if (calc.step === 3) {

        showStep(2);

      } else if (calc.step === 4) {

        showStep(3);

      }

    });

  });


  /* =========================
     NEXT BUTTON
  ========================= */

  qs(".calc-next")?.addEventListener(
    "click",
    () => {

      updateResult();

      showStep(4);

    }
  );


  /* =========================
     CALCULATOR → FORM
  ========================= */

  qs(".calc-order")?.addEventListener(
    "click",
    () => {

      const serviceSelect =
        qs('select[name="service"]');


      const cleanToService = {

        regular:
          "Поддерживающая уборка",

        general:
          "Генеральная уборка",

        repair:
          "Уборка после ремонта"

      };


      if (serviceSelect) {

        serviceSelect.value =
          cleanToService[calc.clean];

      }


      const comment =
        qs('textarea[name="comment"]');


      if (comment) {

        comment.value =
          `Предварительный расчёт: ` +
          `${calculate().toLocaleString("ru-RU")} ₽. ` +
          `${typeNames[calc.type]}, ` +
          `${calc.area} м².`;

      }


      qs("#request")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );


  /* =========================
     FORM DEMO
  ========================= */

  const form =
    qs("#requestForm");


  const success =
    qs("#successMessage");


  const reset =
    qs("#resetForm");


  form?.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      form.style.display =
        "none";


      success.classList.add(
        "visible"
      );

    }
  );


  reset?.addEventListener(
    "click",
    () => {

      form.reset();

      form.style.display =
        "";

      success.classList.remove(
        "visible"
      );

    }
  );


  /* =========================
     PHONE MASK
  ========================= */

  qsa('input[name="phone"]')
    .forEach(input => {

      input.addEventListener(
        "input",
        () => {

          let digits =
            input.value.replace(
              /\D/g,
              ""
            );


          if (digits.startsWith("8")) {

            digits =
              "7" +
              digits.slice(1);

          }


          if (!digits.startsWith("7")) {

            digits =
              "7" +
              digits;

          }


          digits =
            digits.slice(0, 11);


          let value =
            "+7";


          if (digits.length > 1) {

            value +=
              " (" +
              digits.slice(1, 4);

          }


          if (digits.length >= 4) {

            value +=
              ") " +
              digits.slice(4, 7);

          }


          if (digits.length >= 7) {

            value +=
              "-" +
              digits.slice(7, 9);

          }


          if (digits.length >= 9) {

            value +=
              "-" +
              digits.slice(9, 11);

          }


          input.value =
            value;

        }
      );

    });


  /* =========================
     HEADER SCROLL
  ========================= */

  const header =
    qs(".header");


  window.addEventListener(
    "scroll",
    () => {

      header?.classList.toggle(
        "scrolled",
        window.scrollY > 20
      );

    },
    {
      passive: true
    }
  );


  /* =========================
     INITIAL CALCULATOR STATE
  ========================= */

  qs(
    '.choice[data-type="apartment"]'
  )?.classList.add(
    "selected"
  );


  qs(
    '.choice-inline[data-clean="general"]'
  )?.classList.add(
    "selected"
  );


  updateProgress();

});
