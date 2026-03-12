# Environmental Factors and System Optimization

## The Accuracy Formula
**Lighting + Positioning + Resolution = Optimal Recognition Accuracy**

The facial recognition system's performance is significantly influenced by environmental conditions and the subject's interaction with the camera.

## 1. Lighting Conditions
- **Issue**: Poor lighting, harsh shadows, or strong backlighting can obscure facial features, making it difficult for the AI to extract reliable descriptors.
- **Impact**: Increased "Access Denied" errors for registered users and lower confidence scores.
- **Mitigation**:
    - Ensure the scanning area is well-lit with diffused, even light.
    - Avoid cameras facing directly towards windows or bright external light sources.
    - Use auxiliary lighting if the ambient light is insufficient (especially at night).

## 2. Subject Positioning
- **Issue**: Faces at extreme angles (looking up, down, or far to the side) deviate from the frontal templates stored during registration.
- **Impact**: The model might fail to detect a face or produce a descriptor that doesn't match the database record.
- **Mitigation**:
    - Subjects should look directly into the camera lens.
    - The camera should be mounted at eye level.
    - Use on-screen guides (like the oval overlay) to help users align their faces correctly.

## 3. Distance and Resolution
- **Issue**: Subjects standing too far or too close to the camera.
- **Impact**: Low-resolution facial images or distorted features due to proximty.
- **Mitigation**:
    - The subject should be between 0.5m to 1.5m from the camera.
    - Use high-quality webcams with at least 720p resolution.

## 4. Obstructions
- **Issue**: Masks, sunglasses, or heavy scarves covering parts of the face.
- **Mitigation**: Users should briefly remove obstructions during the scan for the highest accuracy.
