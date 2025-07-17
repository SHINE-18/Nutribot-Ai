
import streamlit as st

def get_health_score(ingredients):
    ingredients = ingredients.lower()
    red_flags = ['sugar', 'sodium', 'fat', 'oil', 'preservative']
    score = 100
    for flag in red_flags:
        if flag in ingredients:
            score -= 20
    if score >= 80:
        return '🟢 Healthy Choice'
    elif score >= 50:
        return '🟡 Moderate - Check Labels'
    else:
        return '🔴 Unhealthy - Avoid Frequently'

st.title("🍏 NutriBot - Your Food Health Assistant")
st.write("Type in the ingredients list or a packaged food name to evaluate it.")

input_text = st.text_area("Enter ingredients or product description:")
if st.button("Check Health Score"):
    result = get_health_score(input_text)
    st.success(result)
