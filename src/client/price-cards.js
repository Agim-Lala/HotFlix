async function loadSubscriptionPlans() {
  const container = document.getElementById("price-card-container");
  if (!container) return;

  const token = localStorage.getItem("token");
  let currentPlanId = null;
  let userId = null;

  if (token) {
    try {
      const response = await fetch("http://localhost:5219/api/Auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const user = await response.json();
        currentPlanId = user.subscriptionPlanId ?? null;
        userId = user.id ?? user.userId ?? null;
        userRole = user.role ?? null;
      } else {
        console.warn("/me failed:", response.status, await safeText(response));
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  }

  const url = "http://localhost:5219/api/auth/subscription-plans";
  const options = token
    ? { method: "GET", headers: { Authorization: `Bearer ${token}` } }
    : { method: "GET" };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const body = await safeText(response);
      throw new Error(`Plans fetch failed: ${response.status} ${body}`);
    }
    const plans = await response.json();
    if (!Array.isArray(plans)) {
      throw new Error("Plans payload is not an array");
    }

    container.innerHTML = "";

    plans.forEach((plan) => {
      const card = document.createElement("div");
      card.className = "price-card";

      const featureItem = (text, available = true) => `
    <li class="price-card_list_item">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="${
        available ? "green" : "red"
      }" class="size-4">
        ${
          available
            ? `<path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/>`
            : `<path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"/>`
        }
      </svg>
      ${text}
    </li>
  `;

      const isCurrent = plan.id === currentPlanId;

      let buttonHtml = "";

      if (userRole === "Admin") {
        buttonHtml = "";
      } else {
        const buttonLabel = isCurrent ? "CURRENT PLAN" : "CHOOSE PLAN";
        const buttonClasses = isCurrent
          ? "btn btn-disabled"
          : plan.id === 1
          ? "btn btn-primary"
          : "btn btn-secondary";

        buttonHtml = `
      <div type="button" class="${buttonClasses}" ${
          isCurrent ? 'disabled aria-disabled="true"' : ""
        } data-plan-id="${plan.id}">
        ${buttonLabel}
      </div>
    `;
      }

      card.innerHTML = `
    <ul class="price-card_list">
      <div class="price-card_header">
        <h2>${plan.name}</h2>
        <div class="price-card_header_price">
          <h1>${plan.price === 0 ? "Free" : `$${plan.price}`}</h1>
          ${plan.price === 0 ? "" : "<p>/month</p>"}
        </div>
      </div>
      ${featureItem(`${plan.durationInDays} Days`)}
      ${featureItem(`${plan.resolution} Resolution`)}
      ${featureItem(
        plan.lifetimeAvailability
          ? "Lifetime Availability"
          : "Limited Availability",
        plan.lifetimeAvailability
      )}
      ${featureItem(plan.deviceAccess)}
      ${featureItem(plan.supportLevel)}
    </ul>
    ${buttonHtml}
  `;

      const btn = card.querySelector("div.btn");
      if (!isCurrent && token && userId && btn && userRole !== "Admin") {
        btn.addEventListener("click", async () => {
          try {
            const subscribeResponse = await fetch(
              `http://localhost:5219/api/Auth/users/${userId}/subscribe/${plan.id}`,
              { method: "POST", headers: { Authorization: `Bearer ${token}` } }
            );

            if (subscribeResponse.ok) {
              alert("Subscription updated successfully!");
              await loadSubscriptionPlans();
            } else {
              const msg = await safeText(subscribeResponse);
              alert(
                `Failed to update subscription: ${subscribeResponse.status} ${msg}`
              );
            }
          } catch (err) {
            console.error("Subscription request failed:", err);
            alert("Network error while updating subscription");
          }
        });
      }

      container.appendChild(card);
    });
  } catch (err) {
    if (userId == null) {
      container.innerHTML =
        "<div class='btn btn-primary'> <a href='/signIn'>Log in to choose a plan </a></div>";
    } else {
      console.error("Failed to load subscription plans:", err);
      container.innerHTML = "<p>Failed to load plans.</p>";
    }
  }

  async function safeText(res) {
    try {
      const t = await res.text();
      return t;
    } catch {
      return "";
    }
  }
}

document.addEventListener("DOMContentLoaded", loadSubscriptionPlans);
