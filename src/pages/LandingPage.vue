<template>
  <div class="landing-page">
    <header>
      <nav class="navbar">
        <div class="logo">MyProject</div>
        <ul class="nav-links">
          <li><a href="#features">Преимущества</a></li>
          <li><a href="#about">О нас</a></li>
          <li><a href="#contact">Контакты</a></li>
        </ul>
      </nav>
      <div class="hero">
        <h1>Добро пожаловать на мой лендинг</h1>
        <p>Создай лучшее будущее с нашим решением.</p>
        <button class="cta-button">Начать</button>
      </div>
    </header>
    <section id="features">
      <h2>Наши преимущества</h2>
      <div class="features-container">
        <div class="feature">
          <h3>Качество</h3>
          <p>Мы предлагаем исключительно качественные решения.</p>
        </div>
        <div class="feature">
          <h3>Надёжность</h3>
          <p>Наши продукты проверены временем и опытом.</p>
        </div>
        <div class="feature">
          <h3>Поддержка</h3>
          <p>Круглосуточная поддержка для наших клиентов.</p>
        </div>
      </div>
    </section>
    <section id="about">
      <h2>О нас</h2>
      <p>
        Мы команда профессионалов, стремящихся создавать инновационные решения для вашего бизнеса.
      </p>
    </section>
    <footer id="contact">
      <h2>Контакты</h2>
      <p>Свяжитесь с нами: info@example.com</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LandingPage'
});
</script>

<style scoped lang="scss">
$primary-color: #007bff;
$secondary-color: #00aaff;
$text-color: #333;
$white: #fff;

.landing-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  color: $text-color;
  line-height: 1.6;

  header {
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    color: $white;
    padding-bottom: 4rem;
    border-radius: 1rem;
    margin: 1rem;
    overflow: hidden;

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;

      .logo {
        font-size: 1.8rem;
        font-weight: bold;
      }

      .nav-links {
        list-style: none;
        display: flex;
        gap: 20px;
        margin: 0;
        padding: 0;

        li {
          a {
            color: $white;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            &:hover {
              color: lighten($white, 20%);
            }
          }
        }
      }
    }

    .hero {
      text-align: center;
      margin-top: 40px;
      padding: 0 1rem;

      h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba($text-color, 0.3);
      }

      p {
        font-size: 1.3rem;
        margin-bottom: 30px;
      }

      .cta-button {
        background-color: #ffcc00;
        border: none;
        padding: 15px 30px;
        font-size: 1.2rem;
        font-weight: bold;
        color: $text-color;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
        &:hover {
          background-color: #ffdd33;
          transform: scale(1.05);
        }
      }
    }
  }

  section {
    padding: 40px 20px;
    text-align: center;

    h2 {
      font-size: 2.5rem;
      margin-bottom: 30px;
      position: relative;
      &::after {
        content: '';
        display: block;
        width: 80px;
        height: 3px;
        background: $primary-color;
        margin: 10px auto 0;
        border-radius: 3px;
      }
    }

    p {
      font-size: 1.2rem;
      max-width: 700px;
      margin: 0 auto 20px;
    }

    .features-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 30px;

      .feature {
        flex: 1 1 250px;
        background: #f9f9f9;
        border-radius: 8px;
        padding: 30px 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        h3 {
          font-size: 1.8rem;
          margin-bottom: 15px;
          color: $primary-color;
        }

        p {
          font-size: 1rem;
          color: darken($text-color, 10%);
        }
      }
    }
  }

  footer {
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    color: $white;
    padding: 30px 20px;
    text-align: center;
    border-radius: 1rem;
    margin: 1rem;

    h2 {
      font-size: 2rem;
      margin-bottom: 15px;
    }

    p {
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 768px) {
  header {
    .navbar {
      flex-direction: column;
    }
  }
  section {
    h2 {
      font-size: 2rem;
    }
  }
}
</style>
